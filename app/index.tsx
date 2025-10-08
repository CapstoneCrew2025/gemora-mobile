// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      <Text className="text-2xl font-bold mb-6">Welcome to Gemora</Text>

      {/* Login Button */}
      <Link href="/login" asChild>
        <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-md mb-4">
          <Text className="text-white font-semibold text-base">Login</Text>
        </TouchableOpacity>
      </Link>

      {/* Register Button */}
      <Link href="/register" asChild>
        <TouchableOpacity className="bg-green-600 px-6 py-3 rounded-md">
          <Text className="text-white font-semibold text-base">Register</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
