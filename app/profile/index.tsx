import React, { useState } from 'react'
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  memberSince: string
  totalOrders: number
  totalSpent: number
}

const ProfilePage = () => {
  const [profile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    memberSince: 'January 2023',
    totalOrders: 24,
    totalSpent: 1250.99
  })

  const [notifications, setNotifications] = useState(true)
  const [emailMarketing, setEmailMarketing] = useState(false)
  const [locationServices, setLocationServices] = useState(true)

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="mb-2 text-3xl font-bold text-gray-800">My Profile</Text>
            <Text className="text-gray-600">Manage your account and preferences</Text>
          </View>

          {/* Profile Card */}
          <View className="p-6 mb-6 bg-white border border-gray-200 shadow-lg rounded-xl">
            <View className="items-center mb-6">
              <View className="items-center justify-center w-24 h-24 mb-4 bg-blue-100 rounded-full">
                <Text className="text-4xl">👤</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-800">{profile.name}</Text>
              <Text className="text-gray-600">{profile.email}</Text>
              <View className="px-3 py-1 mt-2 bg-blue-100 rounded-full">
                <Text className="text-sm font-medium text-blue-700">Member since {profile.memberSince}</Text>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row justify-around py-4 border-t border-gray-200">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">{profile.totalOrders}</Text>
                <Text className="text-sm text-gray-500">Total Orders</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">${profile.totalSpent}</Text>
                <Text className="text-sm text-gray-500">Total Spent</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">⭐</Text>
                <Text className="text-sm text-gray-500">Premium</Text>
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <Text className="mb-4 text-xl font-bold text-gray-800">Personal Information</Text>
            
            <View className="space-y-4">
              <View>
                <Text className="mb-1 text-sm font-medium text-gray-600">Full Name</Text>
                <View className="p-3 bg-gray-50 rounded-lg">
                  <Text className="text-gray-800">{profile.name}</Text>
                </View>
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-gray-600">Email Address</Text>
                <View className="p-3 bg-gray-50 rounded-lg">
                  <Text className="text-gray-800">{profile.email}</Text>
                </View>
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-gray-600">Phone Number</Text>
                <View className="p-3 bg-gray-50 rounded-lg">
                  <Text className="text-gray-800">{profile.phone}</Text>
                </View>
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-gray-600">Address</Text>
                <View className="p-3 bg-gray-50 rounded-lg">
                  <Text className="text-gray-800">{profile.address}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity className="p-3 mt-4 bg-blue-600 rounded-lg active:bg-blue-700">
              <Text className="font-semibold text-center text-white">Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Settings */}
          <View className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <Text className="mb-4 text-xl font-bold text-gray-800">Settings</Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-gray-800">Push Notifications</Text>
                  <Text className="text-sm text-gray-500">Receive order updates and offers</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={notifications ? '#ffffff' : '#f3f4f6'}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-gray-800">Email Marketing</Text>
                  <Text className="text-sm text-gray-500">Receive promotional emails</Text>
                </View>
                <Switch
                  value={emailMarketing}
                  onValueChange={setEmailMarketing}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={emailMarketing ? '#ffffff' : '#f3f4f6'}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-gray-800">Location Services</Text>
                  <Text className="text-sm text-gray-500">Help us provide better service</Text>
                </View>
                <Switch
                  value={locationServices}
                  onValueChange={setLocationServices}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={locationServices ? '#ffffff' : '#f3f4f6'}
                />
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <Text className="mb-4 text-xl font-bold text-gray-800">Quick Actions</Text>
            
            <View className="space-y-3">
              <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg active:bg-gray-100">
                <View className="flex-row items-center">
                  <Text className="mr-3 text-2xl">📦</Text>
                  <Text className="font-medium text-gray-800">Order History</Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg active:bg-gray-100">
                <View className="flex-row items-center">
                  <Text className="mr-3 text-2xl">❤️</Text>
                  <Text className="font-medium text-gray-800">Wishlist</Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg active:bg-gray-100">
                <View className="flex-row items-center">
                  <Text className="mr-3 text-2xl">💳</Text>
                  <Text className="font-medium text-gray-800">Payment Methods</Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg active:bg-gray-100">
                <View className="flex-row items-center">
                  <Text className="mr-3 text-2xl">📍</Text>
                  <Text className="font-medium text-gray-800">Addresses</Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Support */}
          <View className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <Text className="mb-4 text-xl font-bold text-gray-800">Support</Text>
            
            <View className="space-y-3">
              <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg active:bg-gray-100">
                <View className="flex-row items-center">
                  <Text className="mr-3 text-2xl">❓</Text>
                  <Text className="font-medium text-gray-800">Help Center</Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg active:bg-gray-100">
                <View className="flex-row items-center">
                  <Text className="mr-3 text-2xl">💬</Text>
                  <Text className="font-medium text-gray-800">Contact Support</Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg active:bg-gray-100">
                <View className="flex-row items-center">
                  <Text className="mr-3 text-2xl">📋</Text>
                  <Text className="font-medium text-gray-800">Terms & Privacy</Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity className="p-4 mb-6 bg-red-600 rounded-xl active:bg-red-700">
            <Text className="text-lg font-bold text-center text-white">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfilePage
