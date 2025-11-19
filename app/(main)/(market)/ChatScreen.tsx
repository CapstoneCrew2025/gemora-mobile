import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import chatService, { ChatMessage } from '../../../lib/chatService';
import { profileService } from '../../../lib/profileService';

export default function ChatScreen() {
  const { sellerId, sellerName, gemName, gemId } = useLocalSearchParams<{
    sellerId: string;
    sellerName?: string;
    gemName?: string;
    gemId: string;
  }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Get current user's profile to get their ID
      const profile = await profileService.getProfile();
      setCurrentUserId(profile.id);
      
      // Fetch chat history
      if (sellerId && gemId) {
        const history = await chatService.getChatHistory(Number(sellerId), Number(gemId));
        setMessages(history.reverse()); // Reverse to show oldest first
        
        // Scroll to bottom after messages load
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      }
    } catch (error: any) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', error.message || 'Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    console.log('=== SEND MESSAGE CLICKED ===');
    console.log('Input message:', inputMessage);
    console.log('Seller ID:', sellerId);
    console.log('Gem ID:', gemId);
    console.log('Sending:', sending);
    console.log('Trimmed message:', inputMessage.trim());
    
    if (!inputMessage.trim()) {
      console.log('❌ Message is empty');
      return;
    }
    
    if (!sellerId) {
      console.log('❌ Seller ID is missing');
      Alert.alert('Error', 'Seller ID is missing');
      return;
    }
    
    if (!gemId) {
      console.log('❌ Gem ID is missing');
      Alert.alert('Error', 'Gem ID is missing. Please try reopening the chat.');
      return;
    }
    
    if (sending) {
      console.log('❌ Already sending a message');
      return;
    }

    const messageContent = inputMessage.trim();
    setInputMessage(''); // Clear input immediately for better UX

    try {
      setSending(true);
      console.log('📤 Sending message to API...');
      console.log('Request data:', {
        receiverId: Number(sellerId),
        gemId: Number(gemId),
        content: messageContent,
      });
      
      const newMessage = await chatService.sendMessage({
        receiverId: Number(sellerId),
        gemId: Number(gemId),
        content: messageContent,
      });

      console.log('✅ Message sent successfully:', newMessage);

      // Add the new message to the list
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert('Error', error.message || 'Failed to send message');
      // Restore the message in input if failed
      setInputMessage(messageContent);
    } finally {
      setSending(false);
      console.log('=== SEND MESSAGE FINISHED ===');
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(main)/(market)');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.senderId === currentUserId;

    return (
      <View
        className={`mb-3 px-4 ${isMyMessage ? 'items-end' : 'items-start'}`}
      >
        <View
          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
            isMyMessage
              ? 'bg-emerald-500 rounded-tr-sm'
              : 'bg-gray-200 rounded-tl-sm'
          }`}
        >
          {!isMyMessage && (
            <Text className="mb-1 text-xs font-semibold text-gray-600">
              {item.senderName}
            </Text>
          )}
          <Text
            className={`text-base leading-5 ${
              isMyMessage ? 'text-white' : 'text-gray-800'
            }`}
          >
            {item.content}
          </Text>
          <Text
            className={`mt-1 text-xs ${
              isMyMessage ? 'text-emerald-100' : 'text-gray-500'
            }`}
          >
            {formatTime(item.sentAt)}
          </Text>
        </View>
      </View>
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEmptyState = () => (
    <View className="items-center justify-center flex-1 px-8">
      <Ionicons name="chatbubbles-outline" size={80} color="#d1d5db" />
      <Text className="mt-4 text-lg font-semibold text-gray-600">
        No messages yet
      </Text>
      <Text className="mt-2 text-center text-gray-500">
        Start the conversation by sending a message
        {gemName && ` about ${gemName}`}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-4 text-gray-600">Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View className="pt-12 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between px-4">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              className="p-2 mr-3 rounded-full"
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {sellerName || `Seller #${sellerId}`}
              </Text>
              {gemName && (
                <Text className="text-sm text-gray-500" numberOfLines={1}>
                  About: {gemName}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity className="p-2" activeOpacity={0.7}>
            <Ionicons name="information-circle-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 16,
          paddingBottom: 8,
        }}
        ListEmptyComponent={renderEmptyState}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
      />

      {/* Input Area */}
      <View className="px-4 py-3 bg-white border-t border-gray-200">
        <View className="flex-row items-center">
          <View className="flex-row items-center flex-1 px-4 py-2 mr-2 bg-gray-100 rounded-full">
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type a message..."
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-gray-800"
              multiline
              maxLength={500}
              editable={!sending}
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
            />
            {inputMessage.length > 0 && (
              <Text className="ml-2 text-xs text-gray-400">
                {inputMessage.length}/500
              </Text>
            )}
          </View>
          <TouchableOpacity
            className={`p-3 rounded-full ${
              inputMessage.trim() && !sending
                ? 'bg-emerald-500'
                : 'bg-gray-300'
            }`}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim() || sending}
            activeOpacity={0.7}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={inputMessage.trim() ? 'white' : '#9ca3af'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
