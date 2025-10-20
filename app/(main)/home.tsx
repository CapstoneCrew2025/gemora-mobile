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
    {/* Header Section with background diamond */}
    <View className="px-6 pt-16 pb-12 relative">
      {/* Background diamond image with opacity */}
      <View className="absolute inset-0 items-center justify-center opacity-15">
        <Text className="text-9xl">💎</Text>
      </View>
      
      <View className="flex-row items-center justify-between mb-6 z-10">
        <View>
          <Text className="text-xl font-bold text-gray-800">Welcome GeMora</Text>
          <Text className="text-sm text-gray-700">Good Morning</Text>
        </View>
        <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-full bg-white">
          <View className="items-center justify-center w-6 h-6 bg-red-500 rounded-full">
              <Text className="text-2xl">🔔</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>

    {/* Main Content Area */}
    <View className="flex-1 px-6 pt-8 bg-gray-50 rounded-t-[40px]">
      
      {/* Buy Gem Card */}
      <TouchableOpacity className="flex-row items-center mb-4 overflow-hidden bg-emerald-500 rounded-3xl">
        {/* Icon Section with vertical divider */}
        <View className="items-center justify-center w-24 h-24">
          <View className="items-center justify-center w-16 h-16 border-4 border-white rounded-full bg-emerald-400">
            <Text className="text-3xl">💎</Text>
          </View>
        </View>
        
        {/* Vertical Divider */}
        <View className="w-px h-16 bg-white/30" />
        
        {/* Text Section */}
        <View className="flex-1 px-6">
          <Text className="text-lg font-bold text-white">Buy Gem</Text>
          <Text className="text-xs text-white/90">Bid For Your Gem</Text>
        </View>
      </TouchableOpacity>

      {/* Sell Gem Card */}
      <TouchableOpacity className="flex-row items-center mb-6 overflow-hidden bg-emerald-500 rounded-3xl">
        {/* Icon Section with vertical divider */}
        <View className="items-center justify-center w-24 h-24">
          <View className="items-center justify-center w-16 h-16 border-4 border-white rounded-full bg-emerald-400">
            <Text className="text-3xl">💰</Text>
          </View>
        </View>
        
        {/* Vertical Divider */}
        <View className="w-px h-16 bg-white/30" />
        
        {/* Text Section */}
        <View className="flex-1 px-6">
          <Text className="text-lg font-bold text-white">Sell Gem</Text>
          <Text className="text-xs text-white/90">Sell Your Precious Gems</Text>
        </View>
      </TouchableOpacity>

    </View>
  </View>
);
}
