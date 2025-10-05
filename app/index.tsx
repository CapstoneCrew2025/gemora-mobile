import { Link } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
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
          <TouchableOpacity className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 active:bg-gray-50">
            <Text className="text-2xl font-semibold text-gray-800 mb-2">📱 Latest Products</Text>
            <Text className="text-gray-600 mb-4">Discover our newest and most popular items</Text>
            <Link href="/product" asChild>
              <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-lg active:bg-blue-700">
                <Text className="text-white font-semibold text-center">View Products</Text>
              </TouchableOpacity>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 active:bg-gray-50">
            <Text className="text-2xl font-semibold text-gray-800 mb-2">🏷️ Browse Categories</Text>
            <Text className="text-gray-600 mb-4">Explore products organized by different categories</Text>
            <Link href="/category" asChild>
              <TouchableOpacity className="bg-green-600 px-6 py-3 rounded-lg active:bg-green-700">
                <Text className="text-white font-semibold text-center">Browse Categories</Text>
              </TouchableOpacity>
            </Link>
          </TouchableOpacity>
        </View>

        {/* Popular Categories Quick Access */}
        <View className="mb-8">
          <Text className="text-2xl font-semibold text-gray-800 mb-4">Popular Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
            <Link href="/category" asChild>
              <TouchableOpacity className="bg-blue-500 rounded-lg p-4 mr-3 min-w-[120px] active:bg-blue-600">
                <Text className="text-3xl mb-2 text-center">📱</Text>
                <Text className="text-white font-semibold text-center">Electronics</Text>
                <Text className="text-blue-100 text-sm text-center">45 items</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/category" asChild>
              <TouchableOpacity className="bg-pink-500 rounded-lg p-4 mr-3 min-w-[120px] active:bg-pink-600">
                <Text className="text-3xl mb-2 text-center">👕</Text>
                <Text className="text-white font-semibold text-center">Fashion</Text>
                <Text className="text-pink-100 text-sm text-center">32 items</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/category" asChild>
              <TouchableOpacity className="bg-green-500 rounded-lg p-4 mr-3 min-w-[120px] active:bg-green-600">
                <Text className="text-3xl mb-2 text-center">🏠</Text>
                <Text className="text-white font-semibold text-center">Home</Text>
                <Text className="text-green-100 text-sm text-center">28 items</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/category" asChild>
              <TouchableOpacity className="bg-orange-500 rounded-lg p-4 mr-3 min-w-[120px] active:bg-orange-600">
                <Text className="text-3xl mb-2 text-center">⚽</Text>
                <Text className="text-white font-semibold text-center">Sports</Text>
                <Text className="text-orange-100 text-sm text-center">19 items</Text>
              </TouchableOpacity>
            </Link>
          </ScrollView>
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