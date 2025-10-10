// app/index.tsx
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth, useAuthActions } from "../store/useAuthStore";

export default function Index() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { logout } = useAuthActions();

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
      <View className="flex-1 justify-center items-center bg-green-50 px-4">
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-green-600 rounded-full items-center justify-center mb-6">
            <Text className="text-white text-3xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</Text>
          <Text className="text-gray-600 text-center text-lg mb-2">
            {user.name || 'User'}
          </Text>
          <Text className="text-gray-500 text-center">
            {user.email}
          </Text>
          <Text className="text-green-600 text-sm font-medium mt-2">
            Role: {user.role}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-600 px-8 py-4 rounded-lg"
        >
          <Text className="text-white font-semibold text-lg text-center">Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show welcome screen for unauthenticated users
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
