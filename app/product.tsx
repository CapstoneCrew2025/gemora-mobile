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

const product = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Link href="/" className="mb-4">
            <Text className="text-blue-600 text-lg">← Back to Home</Text>
          </Link>
          <Text className="text-3xl font-bold text-gray-800 mb-2">Products</Text>
          <Text className="text-gray-600">Discover our amazing collection</Text>
        </View>

        {/* Filter Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Filter by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full mr-3">
              <Text className="text-white font-medium">All</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full mr-3">
              <Text className="text-gray-700 font-medium">Electronics</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full mr-3">
              <Text className="text-gray-700 font-medium">Sports</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full mr-3">
              <Text className="text-gray-700 font-medium">Fashion</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View className="space-y-4">
          {products.map((product) => (
            <TouchableOpacity key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <View className="p-6">
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-4xl mr-3">{product.image}</Text>
                      <View className="flex-1">
                        <Text className="text-xl font-semibold text-gray-800">{product.name}</Text>
                        <Text className="text-gray-500">{product.category}</Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center mb-3">
                      <View className="flex-row items-center mr-4">
                        <Text className="text-yellow-500 mr-1">⭐</Text>
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
                  <TouchableOpacity className={`px-6 py-2 rounded-lg ${product.inStock ? 'bg-blue-600' : 'bg-gray-400'}`}>
                    <Text className="text-white font-semibold">
                      {product.inStock ? 'Add to Cart' : 'Notify Me'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Load More Section */}
        <View className="mt-8 items-center">
          <TouchableOpacity className="bg-gray-200 px-6 py-3 rounded-lg">
            <Text className="text-gray-700 font-semibold">Load More Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default product