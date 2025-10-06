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
          <Link href="/" asChild>
            <TouchableOpacity className="flex-row items-center mb-4">
              <Text className="text-lg text-blue-600">← Back to Home</Text>
            </TouchableOpacity>
          </Link>
          <Text className="mb-2 text-3xl font-bold text-gray-800">Browse Categories</Text>
          <Text className="text-gray-600">Explore our diverse product categories</Text>
        </View>

        {/* Category Grid */}
        <View className="space-y-4">
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl active:bg-gray-50"
              activeOpacity={0.7}
            >
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
                <View className="px-3 py-1 bg-gray-100 rounded-full">
                  <Text className="font-medium text-gray-600">{cat.count}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Browse All Categories Button */}
        <TouchableOpacity className="p-4 mt-6 bg-blue-600 rounded-xl active:bg-blue-700" activeOpacity={0.8}>
          <Text className="text-lg font-semibold text-center text-white">Browse All Categories</Text>
          <Text className="mt-1 text-sm text-center text-blue-100">View complete category list</Text>
        </TouchableOpacity>

        {/* Featured Section */}
        <TouchableOpacity 
          className="p-6 mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl active:opacity-90" 
          activeOpacity={0.9}
        >
          <Text className="mb-2 text-2xl font-bold text-white">Featured Category</Text>
          <Text className="mb-4 text-indigo-100">This week's most popular category - Tap to explore</Text>
          <View className="p-4 bg-white rounded-lg bg-opacity-20">
            <Text className="text-lg font-semibold text-white">Electronics 📱</Text>
            <Text className="text-indigo-100">Latest gadgets and tech accessories</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default category