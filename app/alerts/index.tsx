import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface NotificationItem {
  id: number
  title: string
  message: string
  time: string
  type: 'order' | 'promotion' | 'system' | 'delivery'
  isRead: boolean
  icon: string
}

const AlertsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped and is on its way to you.',
      time: '2 hours ago',
      type: 'order',
      isRead: false,
      icon: '📦'
    },
    {
      id: 2,
      title: 'Flash Sale Alert',
      message: '50% off on all electronics! Limited time offer ending soon.',
      time: '4 hours ago',
      type: 'promotion',
      isRead: false,
      icon: '🏷️'
    },
    {
      id: 3,
      title: 'Delivery Update',
      message: 'Your package will be delivered today between 2:00 PM - 6:00 PM.',
      time: '1 day ago',
      type: 'delivery',
      isRead: true,
      icon: '🚚'
    },
    {
      id: 4,
      title: 'Payment Confirmed',
      message: 'Payment of $199.99 has been successfully processed for order #12344.',
      time: '2 days ago',
      type: 'order',
      isRead: true,
      icon: '💳'
    },
    {
      id: 5,
      title: 'New Arrivals',
      message: 'Check out our latest collection of summer fashion wear.',
      time: '3 days ago',
      type: 'promotion',
      isRead: false,
      icon: '✨'
    },
    {
      id: 6,
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM - 4:00 AM.',
      time: '1 week ago',
      type: 'system',
      isRead: true,
      icon: '⚙️'
    }
  ])

  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'promotion'>('all')

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notif => !notif.isRead)
      case 'order':
        return notifications.filter(notif => notif.type === 'order')
      case 'promotion':
        return notifications.filter(notif => notif.type === 'promotion')
      default:
        return notifications
    }
  }

  const unreadCount = notifications.filter(notif => !notif.isRead).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-700'
      case 'promotion': return 'bg-green-100 text-green-700'
      case 'delivery': return 'bg-orange-100 text-orange-700'
      case 'system': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-3xl font-bold text-gray-800">Notifications</Text>
              {unreadCount > 0 && (
                <View className="px-3 py-1 bg-red-500 rounded-full">
                  <Text className="text-sm font-bold text-white">{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text className="text-gray-600">Stay updated with your latest activities</Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row mb-6 space-x-3">
            <TouchableOpacity 
              className="px-4 py-2 bg-blue-600 rounded-lg active:bg-blue-700"
              onPress={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Text className="font-semibold text-white">Mark All Read</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 bg-gray-200 rounded-lg active:bg-gray-300">
              <Text className="font-semibold text-gray-700">Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
              <TouchableOpacity 
                className={`px-4 py-2 mr-3 rounded-full ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-200'}`}
                onPress={() => setFilter('all')}
              >
                <Text className={`font-medium ${filter === 'all' ? 'text-white' : 'text-gray-700'}`}>
                  All ({notifications.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`px-4 py-2 mr-3 rounded-full ${filter === 'unread' ? 'bg-blue-600' : 'bg-gray-200'}`}
                onPress={() => setFilter('unread')}
              >
                <Text className={`font-medium ${filter === 'unread' ? 'text-white' : 'text-gray-700'}`}>
                  Unread ({unreadCount})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`px-4 py-2 mr-3 rounded-full ${filter === 'order' ? 'bg-blue-600' : 'bg-gray-200'}`}
                onPress={() => setFilter('order')}
              >
                <Text className={`font-medium ${filter === 'order' ? 'text-white' : 'text-gray-700'}`}>
                  Orders
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`px-4 py-2 mr-3 rounded-full ${filter === 'promotion' ? 'bg-blue-600' : 'bg-gray-200'}`}
                onPress={() => setFilter('promotion')}
              >
                <Text className={`font-medium ${filter === 'promotion' ? 'text-white' : 'text-gray-700'}`}>
                  Promotions
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Notifications List */}
          <View className="space-y-3">
            {getFilteredNotifications().length > 0 ? (
              getFilteredNotifications().map((notif) => (
                <TouchableOpacity
                  key={notif.id}
                  className={`p-4 bg-white border border-gray-200 shadow-sm rounded-xl ${!notif.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                  onPress={() => markAsRead(notif.id)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row justify-between mb-2">
                    <View className="flex-row items-center flex-1">
                      <Text className="mr-3 text-2xl">{notif.icon}</Text>
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Text className={`text-lg font-semibold ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notif.title}
                          </Text>
                          {!notif.isRead && (
                            <View className="w-2 h-2 ml-2 bg-blue-500 rounded-full"></View>
                          )}
                        </View>
                        <View className={`px-2 py-1 rounded-full self-start ${getTypeColor(notif.type)}`}>
                          <Text className="text-xs font-medium capitalize">{notif.type}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity 
                      className="p-2"
                      onPress={() => deleteNotification(notif.id)}
                    >
                      <Text className="text-gray-400">✕</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text className={`mb-3 ${!notif.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                    {notif.message}
                  </Text>
                  
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-gray-500">{notif.time}</Text>
                    {!notif.isRead && (
                      <TouchableOpacity 
                        className="px-3 py-1 bg-blue-100 rounded-full"
                        onPress={() => markAsRead(notif.id)}
                      >
                        <Text className="text-xs font-medium text-blue-700">Mark as Read</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              // Empty State
              <View className="items-center justify-center py-12">
                <Text className="mb-4 text-6xl">🔔</Text>
                <Text className="mb-2 text-xl font-semibold text-gray-800">No notifications</Text>
                <Text className="text-gray-600">
                  {filter === 'all' ? 'You\'re all caught up!' : `No ${filter} notifications found`}
                </Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          {getFilteredNotifications().length > 0 && (
            <View className="p-6 mt-8 bg-blue-50 border border-blue-200 rounded-xl">
              <Text className="mb-3 text-lg font-semibold text-gray-800">Quick Actions</Text>
              <View className="space-y-2">
                <TouchableOpacity className="flex-row items-center p-3 bg-white rounded-lg active:bg-gray-50">
                  <Text className="mr-3 text-xl">📱</Text>
                  <Text className="font-medium text-gray-800">Notification Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center p-3 bg-white rounded-lg active:bg-gray-50">
                  <Text className="mr-3 text-xl">🔕</Text>
                  <Text className="font-medium text-gray-800">Do Not Disturb</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default AlertsPage
