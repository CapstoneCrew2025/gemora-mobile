// app/(main)/home/index.tsx
import React, { useCallback, useEffect } from "react";
import { Alert, BackHandler, Text, TouchableOpacity, View } from "react-native";
import { useAuth, useAuthActions } from "../../../store/useAuthStore";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { logout } = useAuthActions();

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

  const handleLogout = useCallback(async () => {
    try {
      console.log('Starting logout process...');
      await logout();
      console.log('Logout successful - layout will handle redirect');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  // Show loading while performing operations
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-green-50">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Note: Auth check is handled by the MainLayout, so we can assume user is authenticated here
  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-green-50">
        <Text className="text-lg text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-emerald-500">
      {/* Header Section */}
      <View className="pt-16 pb-8 px-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-lg font-medium">Welcome GeMora</Text>
            <Text className="text-white/80 text-sm">Good Morning</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Text className="text-white text-lg">👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 bg-gray-100 rounded-t-3xl px-6 pt-6">
        
        {/* Buy Gem Card */}
        <View className="bg-emerald-500 rounded-2xl p-4 mb-4 flex-row items-center">
          <View className="w-12 h-12 bg-blue-400 rounded-full items-center justify-center mr-4">
            <Text className="text-white text-xl">💎</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg">Buy Gem</Text>
            <Text className="text-white/80 text-sm">Bid For Your Gem</Text>
          </View>
        </View>

        {/* Sell Gem Card */}
        <View className="bg-emerald-500 rounded-2xl p-4 mb-6 flex-row items-center">
          <View className="w-12 h-12 bg-blue-400 rounded-full items-center justify-center mr-4">
            <Text className="text-white text-xl">💰</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg">Sell Gem</Text>
            <Text className="text-white/80 text-sm">_______</Text>
          </View>
        </View>

        {/* User Info Section */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-gray-800 font-semibold text-lg mb-2">Account Info</Text>
          <Text className="text-gray-600 mb-1">Name: {user.name || 'User'}</Text>
          <Text className="text-gray-600 mb-1">Email: {user.email}</Text>
          <Text className="text-emerald-600 font-medium">Role: {user.role}</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-500 rounded-2xl p-4 items-center"
        >
          <Text className="text-white font-semibold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View className="bg-white px-6 py-4 flex-row justify-around items-center border-t border-gray-200">
        <TouchableOpacity className="items-center">
          <View className="w-8 h-8 bg-emerald-500 rounded-lg items-center justify-center mb-1">
            <Text className="text-white text-lg">🏠</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-gray-400 text-2xl">📊</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-gray-400 text-2xl">🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-gray-400 text-2xl">💬</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-gray-400 text-2xl">👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
