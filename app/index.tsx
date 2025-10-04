import { Link } from 'expo-router'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import "../global.css"


const index = () => {
  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-800 mb-2">Welcome</Text>
          <Text className="text-lg text-gray-600">Explore our amazing products and categories</Text>
        </View>

        {/* Feature Cards */}
        <View className="space-y-4 mb-8">
          <View className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Text className="text-2xl font-semibold text-gray-800 mb-2">📱 Latest Products</Text>
            <Text className="text-gray-600 mb-4">Discover our newest and most popular items</Text>
            <Link href="/product" className="bg-blue-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-semibold text-center">View Products</Text>
            </Link>
          </View>

          <View className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Text className="text-2xl font-semibold text-gray-800 mb-2">🏷️ Categories</Text>
            <Text className="text-gray-600 mb-4">Browse products by different categories</Text>
            <Link href="/category" className="bg-green-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-semibold text-center">Browse Categories</Text>
            </Link>
          </View>
        </View>

        {/* Stats Section */}
        <View className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</Text>
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