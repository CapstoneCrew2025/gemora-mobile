// app/index.tsx
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth, useAuthActions } from "../store/useAuthStore";

export default function Index() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { logout } = useAuthActions();
  const router = useRouter();

  useEffect(() => {
    console.log('Home screen: Auth state:', { isAuthenticated, user, isLoading });
  }, [isAuthenticated, user, isLoading]);

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-green-50">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Show authenticated user dashboard
  if (isAuthenticated && user) {
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

  // Show welcome screen for unauthenticated users
 return (
    <View className="flex-1 bg-emerald-50 items-center justify-center p-6">
      <View className="w-full px-6 items-center">
        {/* diamond image */}
        <Image
          source={require("../assets/images/diamond.png")}
          resizeMode="contain"
          className="w-40 h-44 mb-6"
        />

        {/* App title */}
        <Text className="text-3xl font-bold text-emerald-600 mb-6">GeMora</Text>
{/* Log In button (filled) */}
<TouchableOpacity
  onPress={() => router.push({ pathname: "/(auth)/login" })}
  className="w-full bg-emerald-500 py-3 rounded-full items-center mb-3"
>
  <Text className="text-white font-semibold">Log In</Text>
</TouchableOpacity>

{/* Sign Up button (filled same color as login) */}
<TouchableOpacity
  onPress={() => router.push({ pathname: "/(auth)/register" })}
  className="w-full bg-emerald-500 py-3 rounded-full items-center mb-4"
>
  <Text className="text-white font-semibold">Sign Up</Text>
</TouchableOpacity>


        {/* Forgot */}
        <TouchableOpacity onPress={() => router.push({ pathname: "/(auth)/forgot" })}>
          <Text className="text-xs text-emerald-700">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      
    </View>
  );
}
