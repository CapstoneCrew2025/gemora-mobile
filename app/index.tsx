import { router } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import "../global.css"


const index = () => {
  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
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
  )
}

export default index