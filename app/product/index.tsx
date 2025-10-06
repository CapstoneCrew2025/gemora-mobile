import { Link } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const products = [
  { 
    id: 1, 
    name: 'Wireless Headphones', 
    price: '$99.99', 
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
    image: '🎧'
  },
  { 
    id: 2, 
    name: 'Smart Watch', 
    price: '$199.99', 
    category: 'Electronics',
    rating: 4.8,
    inStock: true,
    image: '⌚'
  },
  { 
    id: 3, 
    name: 'Running Shoes', 
    price: '$79.99', 
    category: 'Sports',
    rating: 4.3,
    inStock: false,
    image: '👟'
  },
  { 
    id: 4, 
    name: 'Coffee Maker', 
    price: '$129.99', 
    category: 'Home',
    rating: 4.6,
    inStock: true,
    image: '☕'
  },
  { 
    id: 5, 
    name: 'Backpack', 
    price: '$49.99', 
    category: 'Fashion',
    rating: 4.4,
    inStock: true,
    image: '🎒'
  },
]

const index = () => {
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
          <Text className="mb-2 text-3xl font-bold text-gray-800">Products</Text>
          <Text className="text-gray-600">Discover our amazing collection</Text>
          
          {/* Browse Categories Link */}
          <Link href="/category" asChild>
            <TouchableOpacity className="p-3 mt-3 bg-green-100 border border-green-200 rounded-lg active:bg-green-200" activeOpacity={0.8}>
              <Text className="font-semibold text-center text-green-700">🏷️ Browse Categories</Text>
              <Text className="text-sm text-center text-green-600">Explore products by category</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Filter Section */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Filter by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
            <TouchableOpacity className="px-4 py-2 mr-3 bg-blue-600 rounded-full active:bg-blue-700" activeOpacity={0.8}>
              <Text className="font-medium text-white">All</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 mr-3 bg-gray-200 rounded-full active:bg-gray-300" activeOpacity={0.8}>
              <Text className="font-medium text-gray-700">Electronics</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 mr-3 bg-gray-200 rounded-full active:bg-gray-300" activeOpacity={0.8}>
              <Text className="font-medium text-gray-700">Sports</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 mr-3 bg-gray-200 rounded-full active:bg-gray-300" activeOpacity={0.8}>
              <Text className="font-medium text-gray-700">Fashion</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 mr-3 bg-gray-200 rounded-full active:bg-gray-300" activeOpacity={0.8}>
              <Text className="font-medium text-gray-700">Home</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View className="space-y-4">
          {products.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl active:bg-gray-50" 
              activeOpacity={0.9}
            >
              <View className="p-6">
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Text className="mr-3 text-4xl">{product.image}</Text>
                      <View className="flex-1">
                        <Text className="text-xl font-semibold text-gray-800">{product.name}</Text>
                        <TouchableOpacity activeOpacity={0.7}>
                          <Text className="text-blue-600 underline">{product.category}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center mb-3">
                      <View className="flex-row items-center mr-4">
                        <Text className="mr-1 text-yellow-500">⭐</Text>
                        <Text className="text-gray-600">{product.rating}</Text>
                      </View>
                      <View className={`px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Text className={`text-xs font-medium ${product.inStock ? 'text-green-800' : 'text-red-800'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-2xl font-bold text-gray-800">{product.price}</Text>
                  <TouchableOpacity 
                    className={`px-6 py-2 rounded-lg ${product.inStock ? 'bg-blue-600 active:bg-blue-700' : 'bg-gray-400'}`}
                    activeOpacity={0.8}
                  >
                    <Text className="font-semibold text-white">
                      {product.inStock ? 'Add to Cart' : 'Notify Me'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Browse Categories Section */}
        <View className="p-6 mt-8 border border-blue-100 bg-blue-50 rounded-xl">
          <Text className="mb-2 text-xl font-semibold text-gray-800">Looking for something specific?</Text>
          <Text className="mb-4 text-gray-600">Browse our categories to find exactly what you need</Text>
          <Link href="/category" asChild>
            <TouchableOpacity className="p-3 bg-blue-600 rounded-lg active:bg-blue-700" activeOpacity={0.8}>
              <Text className="font-semibold text-center text-white">🏷️ Browse All Categories</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Load More Section */}
        <View className="items-center mt-6">
          <TouchableOpacity className="px-6 py-3 bg-gray-200 rounded-lg active:bg-gray-300" activeOpacity={0.8}>
            <Text className="font-semibold text-gray-700">Load More Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default index