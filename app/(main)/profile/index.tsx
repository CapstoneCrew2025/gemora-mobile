import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getAccessibleImageUrl } from "../../../lib/apiClient";
import { ProfileData, profileService } from "../../../lib/profileService";
import { useAuth, useAuthActions } from "../../../store/useAuthStore";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const { logout } = useAuthActions();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      setImageError(false);
      const profile = await profileService.getProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [logout]);

  // Show loading while performing operations
  if (isLoading || isLoadingProfile) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Note: Auth check is handled by the MainLayout, so we can assume user is authenticated here
  if (!user) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <Text className="text-lg text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  // Use profile data if available, fallback to auth user data
  const displayData = profileData || {
    id: 0,
    name: user.name || 'User',
    email: user.email,
    contactNumber: '',
    selfieImageUrl: '',
    role: user.role
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#f0fdf4' }}>
      {/* Header Section */}
      <View className="relative px-6 pt-16 pb-8 bg-emerald-500">
        {/* Header with back button and notification */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity>
            <Text className="text-2xl text-white">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">Profile</Text>
          <TouchableOpacity className="items-center justify-center w-10 h-10 rounded-full bg-white/20">
            <Text className="text-lg text-white">🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View className="items-center p-6 mx-4 bg-white shadow-lg rounded-3xl" style={{ marginBottom: -50 }}>
          {/* Profile Picture */}
          <View className="mb-4">
            {displayData.selfieImageUrl && !imageError ? (
              <Image 
                source={{ uri: getAccessibleImageUrl(displayData.selfieImageUrl) }}
                resizeMode="cover"
                onError={(e) => {
                  setImageError(true);
                }}
                onLoad={() => {
                  setImageError(false);
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#f3f4f6',
                }}
              />
            ) : (
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#e5e7eb',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 40 }}>👤</Text>
              </View>
            )}
          </View>
          
          {/* User Info */}
          <Text className="mb-1 text-xl font-semibold text-gray-800">{displayData.name}</Text>
          <Text className="text-sm text-gray-500">ID: {displayData.id.toString().padStart(6, '0')}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView className="flex-1 px-6" style={{ paddingTop: 60 }}>
        <View style={{ gap: 16 }}>
          {/* Edit Profile */}
          <TouchableOpacity 
            onPress={() => router.push('/(main)/profile/edit')}
            className="flex-row items-center p-4 bg-blue-500 shadow-sm rounded-2xl"
          >
            <View className="items-center justify-center w-12 h-12 mr-4 bg-white/30 rounded-2xl">
              <Text className="text-2xl text-white">👤</Text>
            </View>
            <Text className="text-lg font-semibold text-white">Edit Profile</Text>
          </TouchableOpacity>

          {/* Security */}
          <TouchableOpacity className="flex-row items-center p-4 bg-blue-500 shadow-sm rounded-2xl">
            <View className="items-center justify-center w-12 h-12 mr-4 bg-white/30 rounded-2xl">
              <Text className="text-2xl text-white">🛡️</Text>
            </View>
            <Text className="text-lg font-semibold text-white">Security</Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity className="flex-row items-center p-4 bg-blue-500 shadow-sm rounded-2xl">
            <View className="items-center justify-center w-12 h-12 mr-4 bg-white/30 rounded-2xl">
              <Text className="text-2xl text-white">⚙️</Text>
            </View>
            <Text className="text-lg font-semibold text-white">Setting</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity 
            onPress={handleLogout}
            className="flex-row items-center p-4 bg-blue-500 shadow-sm rounded-2xl"
          >
            <View className="items-center justify-center w-12 h-12 mr-4 bg-white/30 rounded-2xl">
              <Text className="text-2xl text-white">📋</Text>
            </View>
            <Text className="text-lg font-semibold text-white">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
