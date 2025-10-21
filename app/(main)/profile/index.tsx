import { Stack, router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getAccessibleImageUrl } from "../../../lib/apiClient";
import { ProfileData, profileService } from "../../../lib/profileService";
import { useAuth, useAuthActions } from "../../../store/useAuthStore";
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const { logout } = useAuthActions();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  const [profileLoadError, setProfileLoadError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selfieImageUrl, setSelfieImageUrl] = useState<string | null>(null);

  // Handler to open edit/profile image picker — navigates to edit screen for now
  const handleImagePicker = useCallback(async () => {
    try {
      // Navigate to edit profile screen (adjust route as needed)
      router.push('/profile/edit');
    } catch (error) {
      console.error('Failed to open image picker or navigate:', error);
      Alert.alert('Error', 'Unable to open image picker.');
    }
  }, []);

  // Load profile data on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Reload profile data when screen comes into focus (e.g., after returning from edit screen)
  useFocusEffect(
    useCallback(() => {
      loadProfile();
      setImageRefreshKey(Date.now()); // Force image refresh
    }, [])
  );

  const loadProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      setImageError(false);
      setProfileLoadError(false);
      const profile = await profileService.getProfile();
      setProfileData(profile);
      
      // Set selfie image URL from profile data
      if (profile && profile.selfieImageUrl) {
        setSelfieImageUrl(getAccessibleImageUrl(profile.selfieImageUrl));
      }
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      setProfileData(null);
      setProfileLoadError(true);
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

  // Determine which image to display (priority: selectedImage > selfieImageUrl > placeholder)
  const profileImageSource = selectedImage 
    ? { uri: selectedImage }
    : selfieImageUrl
    ? { uri: selfieImageUrl }
    : null;

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Emerald header */}
      <View className="bg-emerald-500 px-6 pt-12 pb-40 relative">
        {/* Top row: back, centered title, notification (icon only) */}
        <View className="flex-row items-center justify-between z-20">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Text className="text-white text-2xl font-bold">←</Text>
          </TouchableOpacity>

          {/* Title sits visually centered */}
          <Text className="text-lg font-semibold text-gray-800">Profile</Text>

          <TouchableOpacity className="p-2">
            {/* Notification icon only */}
            <Text className="text-2xl">🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* White content area overlapping header */}
      <View className="flex-1 bg-white rounded-t-[40px] -mt-16 px-6 pt-20 relative">
        
        {/* Profile picture circle positioned at the boundary */}
        <TouchableOpacity
          onPress={handleImagePicker}
          className="absolute left-0 right-0 items-center z-30"
          style={{ top: -64 }}
        >
          <View
            style={{
              width: 128,
              height: 128,
              borderRadius: 64,
              borderWidth: 6,
              borderColor: 'white',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {profileImageSource ? (
              <Image
                source={profileImageSource}
                key={imageRefreshKey}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              // Empty circle placeholder
              <View
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  backgroundColor: '#e5e7eb',
                  opacity: 0.9,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 48 }}>👤</Text>
              </View>
            )}
          </View>

          {/* Edit icon overlay */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: -8,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#10b981',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: 'white',
            }}
          >
            <Ionicons name="pencil" size={20} color="white" />
          </View>
        </TouchableOpacity>

        {/* Name and ID */}
        <View className="items-center mb-0 mt-0">
          <Text className="text-xl font-bold text-gray-800 mb-1">
            {profileData?.name ?? displayData.name}
          </Text>
          <Text className="text-sm text-gray-500">
            ID: {(profileData?.id ?? displayData.id).toString().padStart(8, '0')}
          </Text>
        </View>

        {/* Menu items */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ gap: 16, paddingBottom: 32 }}>
            <TouchableOpacity
              onPress={handleImagePicker}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center shadow-sm"
            >
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4">
                <Ionicons name="person-outline" size={22} color="#1e3a8a" />
              </View>
              <Text className="text-base font-medium text-gray-800 flex-1">Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center shadow-sm">
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4">
                <Ionicons name="shield-checkmark-outline" size={22} color="#1e3a8a" />
              </View>
              <Text className="text-base font-medium text-gray-800 flex-1">Security</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center shadow-sm">
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4">
                <Ionicons name="settings-outline" size={22} color="#1e3a8a" />
              </View>
              <Text className="text-base font-medium text-gray-800 flex-1">Setting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center shadow-sm"
            >
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4">
                <Ionicons name="log-out-outline" size={22} color="#1e3a8a" />
              </View>
              <Text className="text-base font-medium text-gray-800 flex-1">Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}