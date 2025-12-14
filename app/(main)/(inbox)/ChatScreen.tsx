import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useTheme } from '../../../context/ThemeContext';
import chatService, { ChatMessage } from '../../../lib/chatService';
import { profileService } from '../../../lib/profileService';

export default function ChatScreen() {
  const { sellerId, gemName, gemDescription, gemId } = useLocalSearchParams<{
    sellerId: string;
    gemName?: string;
    gemDescription?: string;
    gemId: string;
  }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const { theme } = useTheme();

  const styles = useMemo(() => ({
    background: { backgroundColor: theme.colors.background },
    card: { backgroundColor: theme.colors.card },
    text: { color: theme.colors.text },
    subtext: { color: theme.colors.subtext },
    border: { borderColor: theme.colors.border },
    primaryBg: { backgroundColor: theme.colors.primary },
    input: { backgroundColor: theme.colors.card },
    disabledSend: { backgroundColor: theme.colors.border },
  }), [theme]);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Get current user's profile to get their ID
      const profile = await profileService.getProfile();
      setCurrentUserId(profile.id);
      
      // Fetch chat history using the POST API
      if (sellerId && gemId) {
        const history = await chatService.getChatHistory(Number(sellerId), Number(gemId));
        setMessages(history); // Keep original order - newest at bottom
        
        // Mark messages as read when opening the chat
        chatService.markAsRead(Number(sellerId), Number(gemId));
        
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
    if (!inputMessage.trim() || !sellerId || !gemId || sending) return;

    const messageContent = inputMessage.trim();
    setInputMessage(''); // Clear input immediately for better UX

    try {
      setSending(true);
      
      const newMessage = await chatService.sendMessage({
        receiverId: Number(sellerId),
        gemId: Number(gemId),
        content: messageContent,
      });

      // Add the new message to the list
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert('Error', error.message || 'Failed to send message');
      // Restore the message in input if failed
      setInputMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(main)/(inbox)');
    }
  };

  const handleDeleteChat = () => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this entire conversation? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await chatService.deleteChat(Number(sellerId), Number(gemId));
              Alert.alert('Success', 'Conversation deleted successfully');
              handleGoBack();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete conversation');
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.senderId === currentUserId;

    return (
      <View
        className={`mb-3 px-4 ${isMyMessage ? 'items-end' : 'items-start'}`}
      >
        <View
          className={`max-w-[75%] rounded-2xl px-4 py-3 ${isMyMessage ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
          style={isMyMessage ? styles.primaryBg : styles.card}
        >
          {!isMyMessage && (
            <Text className="mb-1 text-xs font-semibold" style={styles.subtext}>
              {item.senderName}
            </Text>
          )}
          <Text
            className="text-base leading-5"
            style={isMyMessage ? { color: '#fff' } : styles.text}
          >
            {item.content}
          </Text>
          <Text
            className="mt-1 text-xs"
            style={isMyMessage ? { color: '#e0f2f1' } : styles.subtext}
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
    <View className="items-center justify-center flex-1 px-8" style={styles.background}>
      <Ionicons name="chatbubbles-outline" size={80} color={theme.colors.subtext} />
      <Text className="mt-4 text-lg font-semibold" style={styles.text}>
        No messages yet
      </Text>
      <Text className="mt-2 text-center" style={styles.subtext}>
        Start the conversation by sending a message
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="items-center justify-center flex-1" style={styles.background}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text className="mt-4" style={styles.subtext}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={styles.background}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View className="pt-12 pb-4 border-b" style={[styles.card, styles.border]}> 
        <View className="flex-row items-center justify-between px-4">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              className="p-2 mr-3 rounded-full"
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-lg font-bold" style={styles.text} numberOfLines={1}>
                {gemName ? decodeURIComponent(gemName) : 'Gem Chat'}
              </Text>
              {gemDescription && (
                <Text className="text-sm" style={styles.subtext} numberOfLines={1}>
                  {decodeURIComponent(gemDescription)}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            className="p-2 rounded-full"
            onPress={handleDeleteChat}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
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
      <View className="px-4 py-3 border-t" style={[styles.card, styles.border]}>
        <View className="flex-row items-center">
          <View className="flex-row items-center flex-1 px-4 py-2 mr-2 rounded-full" style={styles.input}>
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.subtext}
              className="flex-1 text-base"
              style={styles.text}
              multiline
              maxLength={500}
              editable={!sending}
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
            />
            {inputMessage.length > 0 && (
              <Text className="ml-2 text-xs" style={styles.subtext}>
                {inputMessage.length}/500
              </Text>
            )}
          </View>
          <TouchableOpacity
            className="p-3 rounded-full"
            style={inputMessage.trim() && !sending ? styles.primaryBg : [styles.disabledSend, styles.border, { borderWidth: 1 }]}
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
                color={inputMessage.trim() ? 'white' : theme.colors.subtext}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
