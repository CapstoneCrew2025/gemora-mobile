import { chatService, InboxItem } from '@/lib/chatService';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export default function Inbox() {
  const [conversations, setConversations] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();

  const styles = useMemo(() => ({
    background: { backgroundColor: theme.colors.background },
    header: { backgroundColor: theme.colors.primary },
    card: { backgroundColor: theme.colors.card },
    text: { color: theme.colors.text },
    subtext: { color: theme.colors.subtext },
    border: { borderColor: theme.colors.border },
    badgeBg: { backgroundColor: theme.colors.primary },
  }), [theme]);

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
      pathname: '/(main)/(inbox)/ChatScreen',
      params: {
        sellerId: item.otherUserId.toString(),
        gemName: item.gemName,
        gemDescription: item.gemDescription,
        gemId: item.gemId.toString(),
      },
    });
  };

  return (
    <View className="flex-1" style={styles.background}>
      <View className="flex-row items-center justify-between px-4 py-3 pt-5 " style={styles.header}>
        <View>
          <Text className="mt-12 text-2xl font-bold text-white">Inbox</Text>
          <Text className=" text-white/80">Messages & Offers</Text>
        </View>
      </View>

      {loading ? (
        <View className="items-center justify-center flex-1" style={styles.background}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text className="mt-3" style={styles.subtext}>
            Loading conversations...
          </Text>
        </View>
      ) : conversations.length === 0 ? (
        <View className="items-center justify-center flex-1 px-6" style={styles.background}>
          <View className="p-4 rounded-xl" style={styles.card}>
            <Text className="text-lg font-semibold text-center" style={styles.text}>
              No Messages Yet
            </Text>
            <Text className="mt-2 text-center" style={styles.subtext}>
              Start a conversation by exploring gems in the marketplace.
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={conversations}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
          keyExtractor={(item) => item.roomId}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleConversationPress(item)}
              className="px-4 py-3"
              style={[styles.card, styles.border, { borderBottomWidth: 1 }]}
            >
              <View className="flex-row items-center">
                <View className="mr-3 overflow-hidden rounded-full h-14 w-14" style={styles.border}>
                  <View className="items-center justify-center h-14 w-14" style={[styles.background, styles.border]}>
                    <Text className="text-xl font-semibold" style={styles.text}>
                      {item.gemName?.charAt(0) || 'G'}
                    </Text>
                  </View>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold" style={styles.text} numberOfLines={1}>
                      {item.gemName || 'Gem conversation'}
                    </Text>
                    <Text className="ml-2 text-xs" style={styles.subtext}>
                      {item.lastSentAt}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="flex-1" style={styles.subtext} numberOfLines={1}>
                      {item.lastMessage}
                    </Text>
                    {item.unreadCount > 0 && (
                      <View className="px-2 py-1 ml-2 rounded-full" style={styles.badgeBg}>
                        <Text className="text-xs font-semibold text-white">{item.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
