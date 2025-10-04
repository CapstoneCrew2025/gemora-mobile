import { Link } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const categories = [
  { id: 1, name: 'Electronics', icon: '📱', count: 45, color: 'bg-blue-500' },
  { id: 2, name: 'Fashion', icon: '👕', count: 32, color: 'bg-pink-500' },
  { id: 3, name: 'Home & Garden', icon: '🏠', count: 28, color: 'bg-green-500' },
  { id: 4, name: 'Sports', icon: '⚽', count: 19, color: 'bg-orange-500' },
  { id: 5, name: 'Books', icon: '📚', count: 26, color: 'bg-purple-500' },
  { id: 6, name: 'Beauty', icon: '💄', count: 15, color: 'bg-rose-500' },
]

const category = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Link href="/" className="mb-4">
            <Text className="text-blue-600 text-lg">← Back to Home</Text>
          </Link>
          <Text className="text-3xl font-bold text-gray-800 mb-2">Categories</Text>
          <Text className="text-gray-600">Browse products by category</Text>
        </View>

        {/* Category Grid */}
        <View className="space-y-4">
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center space-x-4">
                  <View className={`w-12 h-12 ${cat.color} rounded-full items-center justify-center`}>
                    <Text className="text-2xl">{cat.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-xl font-semibold text-gray-800">{cat.name}</Text>
                    <Text className="text-gray-500">{cat.count} items available</Text>
                  </View>
                </View>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-600 font-medium">{cat.count}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Section */}
        <View className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6">
          <Text className="text-white text-2xl font-bold mb-2">Featured Category</Text>
          <Text className="text-indigo-100 mb-4">This week's most popular category</Text>
          <View className="bg-white bg-opacity-20 rounded-lg p-4">
            <Text className="text-white text-lg font-semibold">Electronics 📱</Text>
            <Text className="text-indigo-100">Latest gadgets and tech accessories</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default category