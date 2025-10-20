// app/(main)/home.tsx
import React, { useEffect } from "react";
import { Alert, BackHandler, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../store/useAuthStore";

export default function Home() {
  const { user, isLoading } = useAuth();

  // Handle back button to close app instead of navigating back
  useEffect(() => {
    const backAction = () => {
      // Show confirmation before closing app
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel'
          },
          {
            text: 'Exit',
            onPress: () => BackHandler.exitApp()
          }
        ]
      );
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  // Show loading while performing operations
  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-green-50">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Note: Auth check is handled by the MainLayout, so we can assume user is authenticated here
  if (!user) {
    return (
      <View className="items-center justify-center flex-1 bg-green-50">
        <Text className="text-lg text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-emerald-500">
      {/* Header Section */}
      <View className="px-6 pt-16 pb-8">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-lg font-medium text-white">Welcome GeMora</Text>
            <Text className="text-sm text-white/80">Good Morning</Text>
          </View>
          <TouchableOpacity className="items-center justify-center w-10 h-10 rounded-full bg-white/20">
            <Text className="text-lg text-white">�</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 px-6 pt-6 bg-gray-100 rounded-t-3xl">
        
        {/* Buy Gem Card */}
        <TouchableOpacity className="flex-row items-center p-6 mb-4 bg-emerald-500 rounded-2xl">
          <View className="items-center justify-center w-16 h-16 mr-4 bg-blue-400 rounded-full">
            <Text className="text-2xl text-white">💎</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-semibold text-white">Buy Gem</Text>
            <Text className="text-sm text-white/80">Bid For Your Gem</Text>
          </View>
        </TouchableOpacity>

        {/* Sell Gem Card */}
        <TouchableOpacity className="flex-row items-center p-6 mb-6 bg-emerald-500 rounded-2xl">
          <View className="items-center justify-center w-16 h-16 mr-4 bg-blue-400 rounded-full">
            <Text className="text-2xl text-white">💰</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-semibold text-white">Sell Gem</Text>
            <Text className="text-sm text-white/80">Sell Your Precious Gems</Text>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
}
