import { router } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      quantity: 1,
      image: '🎧',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      quantity: 2,
      image: '⌚',
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Running Shoes',
      price: 79.99,
      quantity: 1,
      image: '👟',
      category: 'Sports'
    }
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.1 // 10% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="mb-2 text-3xl font-bold text-gray-800">Shopping Cart</Text>
            <Text className="text-gray-600">{cartItems.length} items in your cart</Text>
          </View>

          {/* Cart Items */}
          {cartItems.length > 0 ? (
            <View className="mb-6 space-y-4">
              {cartItems.map((item) => (
                <View 
                  key={item.id}
                  className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl"
                >
                  <View className="flex-row justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View className="items-center justify-center w-16 h-16 mr-4 bg-gray-100 rounded-lg">
                        <Text className="text-3xl">{item.image}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
                        <Text className="text-sm text-gray-500">{item.category}</Text>
                        <Text className="mt-1 text-lg font-bold text-blue-600">${item.price.toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Quantity Controls */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-3">
                      <TouchableOpacity 
                        className="items-center justify-center w-8 h-8 bg-gray-200 rounded-full active:bg-gray-300"
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Text className="text-lg font-bold text-gray-700">-</Text>
                      </TouchableOpacity>
                      <Text className="px-4 text-lg font-semibold text-gray-800">{item.quantity}</Text>
                      <TouchableOpacity 
                        className="items-center justify-center w-8 h-8 bg-blue-600 rounded-full active:bg-blue-700"
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Text className="text-lg font-bold text-white">+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Remove Button */}
                    <TouchableOpacity 
                      className="px-4 py-2 bg-red-100 rounded-lg active:bg-red-200"
                      onPress={() => removeItem(item.id)}
                    >
                      <Text className="font-semibold text-red-600">Remove</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Item Total */}
                  <View className="pt-3 mt-3 border-t border-gray-200">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Item Total:</Text>
                      <Text className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            // Empty Cart
            <View className="items-center justify-center py-12">
              <Text className="mb-4 text-6xl">🛒</Text>
              <Text className="mb-2 text-xl font-semibold text-gray-800">Your cart is empty</Text>
              <Text className="mb-6 text-gray-600">Add some items to get started</Text>
              <TouchableOpacity 
                className="px-6 py-3 bg-blue-600 rounded-lg active:bg-blue-700"
                onPress={() => router.push('/shop/products')}
              >
                <Text className="font-semibold text-white">Browse Products</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Price Summary */}
          {cartItems.length > 0 && (
            <View className="p-6 mb-6 bg-white border border-gray-200 shadow-lg rounded-xl">
              <Text className="mb-4 text-xl font-bold text-gray-800">Order Summary</Text>
              
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text className="font-semibold text-gray-800">${calculateSubtotal().toFixed(2)}</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Tax (10%)</Text>
                  <Text className="font-semibold text-gray-800">${calculateTax().toFixed(2)}</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Shipping</Text>
                  <Text className="font-semibold text-green-600">FREE</Text>
                </View>

                <View className="pt-3 mt-3 border-t-2 border-gray-300">
                  <View className="flex-row justify-between">
                    <Text className="text-lg font-bold text-gray-800">Total</Text>
                    <Text className="text-2xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          {cartItems.length > 0 && (
            <View className="mb-6 space-y-3">
              <TouchableOpacity 
                className="p-4 bg-blue-600 rounded-xl active:bg-blue-700"
                onPress={() => {
                  // Handle checkout
                  console.log('Proceeding to checkout...')
                }}
              >
                <Text className="text-lg font-bold text-center text-white">
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="p-4 bg-white border-2 border-blue-600 rounded-xl active:bg-gray-50"
                onPress={() => router.push('/shop/products')}
              >
                <Text className="text-lg font-bold text-center text-blue-600">
                  Continue Shopping
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Promo Code Section */}
          {cartItems.length > 0 && (
            <View className="p-6 border border-blue-200 bg-blue-50 rounded-xl">
              <Text className="mb-3 text-lg font-semibold text-gray-800">Have a promo code?</Text>
              <View className="flex-row space-x-2">
                <View className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg">
                  <Text className="text-gray-400">Enter code</Text>
                </View>
                <TouchableOpacity className="px-6 py-3 bg-blue-600 rounded-lg active:bg-blue-700">
                  <Text className="font-semibold text-white">Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default CartPage
