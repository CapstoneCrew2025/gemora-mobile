// app/(main)/marketplace/index.tsx
import React from "react";
import { Text, View } from "react-native";

export default function Marketplace() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Text className="text-xl font-bold text-gray-800 mb-2">Marketplace</Text>
      <Text className="text-gray-600">Coming Soon...</Text>
    </View>
  );
}
