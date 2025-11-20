import { chatService, InboxItem } from '@/lib/chatService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

export default function Inbox() {
  const [conversations, setConversations] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInbox = async () => {
    try {
      const data = await chatService.getInbox();
      setConversations(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch inbox');
      console.error('Error fetching inbox:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInbox();
  };

  const handleConversationPress = (item: InboxItem) => {
    router.push({
      pathname: '/(main)/(market)/ChatScreen',
      params: {
        sellerId: item.otherUserId.toString(),
        gemId: item.gemId.toString(),
        sellerName: encodeURIComponent(item.otherUserName),
      },
    });
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderConversationItem = ({ item }: { item: InboxItem }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200"
      onPress={() => handleConversationPress(item)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View className="items-center justify-center w-12 h-12 mr-3 rounded-full bg-emerald-100">
        <Text className="text-lg font-bold text-emerald-600">
          {item.otherUserName.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
            {item.otherUserName}
          </Text>
          <Text className="text-xs text-gray-500">
            {formatTimestamp(item.lastSentAt)}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between">
          <Text 
            className={`text-sm ${item.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
            numberOfLines={1}
            style={{ flex: 1 }}
          >
            {item.lastMessage}
          </Text>
          
          {item.unreadCount > 0 && (
            <View className="items-center justify-center w-5 h-5 ml-2 rounded-full bg-emerald-500">
              <Text className="text-xs font-bold text-white">
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-4 text-gray-600">Loading conversations...</Text>
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View className="items-center justify-center flex-1 px-6 bg-gray-50">
        <Text className="mb-4 text-6xl">💬</Text>
        <Text className="mb-2 text-xl font-bold text-gray-800">No messages yet</Text>
        <Text className="text-center text-gray-600">
          Start a conversation by contacting a seller from the marketplace
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.roomId}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10b981']}
            tintColor="#10b981"
          />
        }
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
      />
    </View>
  );
}
