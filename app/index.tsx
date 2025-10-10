// app/index.tsx
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-green-50 px-4">
      <View className="items-center mb-12">
        <View className="w-24 h-24 bg-green-600 rounded-full items-center justify-center mb-6">
          <Text className="text-white text-3xl font-bold">G</Text>
        </View>
        <Text className="text-4xl font-bold text-gray-900 mb-2">GeMora</Text>
        <Text className="text-gray-600 text-center text-lg">
          Your gateway to amazing experiences
        </Text>
      </View>

      {/* Login Button */}
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity className="bg-green-600 px-8 py-4 rounded-lg mb-4 w-full max-w-sm">
          <Text className="text-white font-semibold text-lg text-center">Sign In</Text>
        </TouchableOpacity>
      </Link>

      {/* Register Button */}
      <Link href="/(auth)/register" asChild>
        <TouchableOpacity className="bg-green-100 border border-green-600 px-8 py-4 rounded-lg w-full max-w-sm">
          <Text className="text-green-600 font-semibold text-lg text-center">Create Account</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
