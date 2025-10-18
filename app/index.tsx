// app/index.tsx
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../store/useAuthStore";

export default function Index() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're authenticated and not loading
    if (!isLoading && isAuthenticated && user) {
      // Use push instead of replace to avoid navigation issues
      router.push('/(main)/home');
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-green-50">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Don't show anything while redirecting to avoid flash
  if (isAuthenticated && user) {
    return (
      <View className="items-center justify-center flex-1 bg-green-50">
        <Text className="text-lg text-gray-600">Redirecting...</Text>
      </View>
    );
  }

  // Show welcome screen for unauthenticated users
 return (
    <View className="items-center justify-center flex-1 p-6 bg-emerald-50">
      <View className="items-center w-full px-6">
        {/* diamond image */}
        <Image
          source={require("../assets/images/diamond.png")}
          resizeMode="contain"
          className="w-40 mb-6 h-44"
        />

        {/* App title */}
        <Text className="mb-6 text-3xl font-bold text-emerald-600">GeMora</Text>
{/* Log In button (filled) */}
<TouchableOpacity
  onPress={() => router.push({ pathname: "/(auth)/login" })}
  className="items-center w-full py-3 mb-3 rounded-full bg-emerald-500"
>
  <Text className="font-semibold text-white">Log In</Text>
</TouchableOpacity>

{/* Sign Up button (filled same color as login) */}
<TouchableOpacity
  onPress={() => router.push({ pathname: "/(auth)/register" })}
  className="items-center w-full py-3 mb-4 rounded-full bg-emerald-500"
>
  <Text className="font-semibold text-white">Sign Up</Text>
</TouchableOpacity>


        {/* Forgot */}
        <TouchableOpacity onPress={() => router.push({ pathname: "/(auth)/forgot" })}>
          <Text className="text-xs text-emerald-700">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      
    </View>
  );
}
