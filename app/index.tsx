import { router } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import "../global.css"


const index = () => {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <ScrollView className="flex-1">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="mb-2 text-4xl font-bold text-gray-800">Welcome</Text>
          <Text className="text-lg text-gray-600">Explore our amazing products and categories</Text>
        </View>

        {/* Feature Cards */}
        <View className="mb-8 space-y-4">
          <TouchableOpacity 
            className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl active:bg-gray-50"
            onPress={() => router.push('/product')}
          >
            <Text className="mb-2 text-2xl font-semibold text-gray-800">📱 Latest Products</Text>
            <Text className="mb-4 text-gray-600">Discover our newest and most popular items</Text>
            <View className="px-6 py-3 bg-blue-600 rounded-lg">
              <Text className="font-semibold text-center text-white">View Products</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl active:bg-gray-50"
            onPress={() => router.push('/category')}
          >
            <Text className="mb-2 text-2xl font-semibold text-gray-800">🏷️ Browse Categories</Text>
            <Text className="mb-4 text-gray-600">Explore products organized by different categories</Text>
            <View className="px-6 py-3 bg-green-600 rounded-lg">
              <Text className="font-semibold text-center text-white">Browse Categories</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Popular Categories Quick Access */}
        <View className="mb-8">
          <Text className="mb-4 text-2xl font-semibold text-gray-800">Popular Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
            <TouchableOpacity 
              className="bg-blue-500 rounded-lg p-4 mr-3 min-w-[120px] active:bg-blue-600"
              onPress={() => router.push('/category')}
            >
              <Text className="mb-2 text-3xl text-center">📱</Text>
              <Text className="font-semibold text-center text-white">Electronics</Text>
              <Text className="text-sm text-center text-blue-100">45 items</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-pink-500 rounded-lg p-4 mr-3 min-w-[120px] active:bg-pink-600"
              onPress={() => router.push('/category')}
            >
              <Text className="mb-2 text-3xl text-center">👕</Text>
              <Text className="font-semibold text-center text-white">Fashion</Text>
              <Text className="text-sm text-center text-pink-100">32 items</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-green-500 rounded-lg p-4 mr-3 min-w-[120px] active:bg-green-600"
              onPress={() => router.push('/category')}
            >
              <Text className="mb-2 text-3xl text-center">🏠</Text>
              <Text className="font-semibold text-center text-white">Home</Text>
              <Text className="text-sm text-center text-green-100">28 items</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-orange-500 rounded-lg p-4 mr-3 min-w-[120px] active:bg-orange-600"
              onPress={() => router.push('/category')}
            >
              <Text className="mb-2 text-3xl text-center">⚽</Text>
              <Text className="font-semibold text-center text-white">Sports</Text>
              <Text className="text-sm text-center text-orange-100">19 items</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl">
          <Text className="mb-4 text-xl font-semibold text-gray-800">Quick Stats</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">150+</Text>
              <Text className="text-gray-500">Products</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">25+</Text>
              <Text className="text-gray-500">Categories</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">1k+</Text>
              <Text className="text-gray-500">Happy Users</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

    {/* Footer Navigation */}
    <View className="bg-white border-t border-gray-200 shadow-lg">
      <View className="flex-row items-center justify-around px-4 py-3">
        {/* Home Tab */}
        <TouchableOpacity 
          className="items-center flex-1"
          onPress={() => setActiveTab('home')}
        >
          <Text className={`text-2xl mb-1 ${activeTab === 'home' ? 'opacity-100' : 'opacity-40'}`}>🏠</Text>
          <Text className={`text-xs font-medium ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-500'}`}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Cart Tab */}
        <TouchableOpacity 
          className="items-center flex-1"
          onPress={() => setActiveTab('cart')}
        >
          <View className="relative">
            <Text className={`text-2xl mb-1 ${activeTab === 'cart' ? 'opacity-100' : 'opacity-40'}`}>🛒</Text>
            {/* Cart Badge */}
            <View className="absolute items-center justify-center w-4 h-4 bg-red-500 rounded-full -top-1 -right-1">
              <Text className="text-xs font-bold text-white">3</Text>
            </View>
          </View>
          <Text className={`text-xs font-medium ${activeTab === 'cart' ? 'text-blue-600' : 'text-gray-500'}`}>
            Cart
          </Text>
        </TouchableOpacity>

        {/* Notifications Tab */}
        <TouchableOpacity 
          className="items-center flex-1"
          onPress={() => setActiveTab('notifications')}
        >
          <View className="relative">
            <Text className={`text-2xl mb-1 ${activeTab === 'notifications' ? 'opacity-100' : 'opacity-40'}`}>🔔</Text>
            {/* Notification Badge */}
            <View className="absolute items-center justify-center w-4 h-4 bg-red-500 rounded-full -top-1 -right-1">
              <Text className="text-xs font-bold text-white">5</Text>
            </View>
          </View>
          <Text className={`text-xs font-medium ${activeTab === 'notifications' ? 'text-blue-600' : 'text-gray-500'}`}>
            Alerts
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity 
          className="items-center flex-1"
          onPress={() => setActiveTab('profile')}
        >
          <Text className={`text-2xl mb-1 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-40'}`}>👤</Text>
          <Text className={`text-xs font-medium ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  )
}

export default index