// app/index.tsx
import { Link, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
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
