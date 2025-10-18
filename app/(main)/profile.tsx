// app/(main)/profile.tsx
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth, useAuthActions } from "../../store/useAuthStore";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const { logout } = useAuthActions();

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
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header Section */}
      <View className="bg-emerald-500 pt-16 pb-8 px-6">
        <View className="items-center">
          <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-4xl">👤</Text>
          </View>
          <Text className="text-white text-xl font-semibold">{user.name || 'User'}</Text>
          <Text className="text-white/80 text-sm">{user.email}</Text>
          <View className="bg-white/20 rounded-full px-3 py-1 mt-2">
            <Text className="text-white text-xs font-medium">{user.role}</Text>
          </View>
        </View>
      </View>

      {/* Profile Content */}
      <View className="px-6 pt-6">
        
        {/* Account Information */}
        <View className="bg-white rounded-2xl p-6 mb-4">
          <Text className="text-gray-800 font-semibold text-lg mb-4">Account Information</Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Full Name</Text>
              <Text className="text-gray-800 font-medium">{user.name || 'User'}</Text>
            </View>
            
            <View className="flex-row justify-between items-center py-2 border-t border-gray-100">
              <Text className="text-gray-600">Email</Text>
              <Text className="text-gray-800 font-medium">{user.email}</Text>
            </View>
            
            <View className="flex-row justify-between items-center py-2 border-t border-gray-100">
              <Text className="text-gray-600">Account Type</Text>
              <Text className="text-emerald-600 font-medium">{user.role}</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View className="bg-white rounded-2xl p-6 mb-4">
          <Text className="text-gray-800 font-semibold text-lg mb-4">Settings</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">🔔</Text>
              <Text className="text-gray-700">Notifications</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">🔒</Text>
              <Text className="text-gray-700">Privacy & Security</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">❓</Text>
              <Text className="text-gray-700">Help & Support</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-500 rounded-2xl p-4 items-center mb-6"
        >
          <Text className="text-white font-semibold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
