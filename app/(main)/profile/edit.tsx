import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../../../components/common/Input";
import { getAccessibleImageUrl } from "../../../lib/apiClient";
import { ProfileData, profileService, UpdateProfileRequest } from "../../../lib/profileService";
import { useThemeStore } from "../../../store/useThemeStore";
import { Ionicons } from '@expo/vector-icons';

export default function EditProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { isDarkTheme, toggleTheme, loadTheme } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    contactNumber: '',
  });

  // Load profile data and theme
  useEffect(() => {
    loadProfile();
    loadTheme();
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const profile = await profileService.getProfile();
      setProfileData(profile);
      setFormData({
        name: profile.name,
        contactNumber: profile.contactNumber,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera roll permissions to change your profile picture.');
      return false;
    }
    return true;
  };

  const handleImagePicker = useCallback(async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Select Profile Picture',
      'Choose how you would like to select your profile picture',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
      ]
    );
  }, []);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { name: '', contactNumber: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid contact number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setIsUpdating(true);
      
      const updateData: UpdateProfileRequest = {
        name: formData.name.trim(),
        contactNumber: formData.contactNumber.trim(),
        ...(selectedImage && { selfieImage: selectedImage }),
      };

      const updatedProfile = await profileService.updateProfile(updateData);
      
      setProfileData(updatedProfile);
      setFormData({
        name: updatedProfile.name,
        contactNumber: updatedProfile.contactNumber,
      });
      setSelectedImage(null);
      
      Alert.alert('Success', 'Profile updated successfully', [
        { 
          text: 'OK', 
          onPress: () => {
            router.back();
          }
        }
      ]);
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }, [formData, selectedImage]);

  if (isLoading) {
    return (
      <View className={`items-center justify-center flex-1 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Text className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View className={`items-center justify-center flex-1 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Text className="mb-4 text-lg font-semibold text-red-600">Failed to load profile</Text>
        <TouchableOpacity onPress={loadProfile} className="px-6 py-3 rounded-2xl bg-emerald-500">
          <Text className="font-semibold text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Emerald header */}
      <View className="bg-emerald-500 px-6 pt-12 pb-40 relative">
        <View className="flex-row items-center justify-between z-20">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Text className="text-white text-2xl font-bold">←</Text>
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-800">Edit My Profile</Text>

          <TouchableOpacity className="p-2">
            <Text className="text-2xl">🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* White content area overlapping header */}
      <View className={`flex-1 rounded-t-[40px] -mt-16 px-6 pt-20 relative ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
        
        {/* Profile picture circle with camera icon positioned at the boundary */}
        <View className="absolute left-0 right-0 items-center z-30" style={{ top: -64 }}>
          <View style={{ position: 'relative', width: 128, height: 128 }}>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={{
                position: 'relative',
                width: 128,
                height: 128,
                borderRadius: 64,
                borderWidth: 6,
                borderColor: 'white',
                overflow: 'visible',
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
              {(selectedImage || profileData.selfieImageUrl) ? (
                <Image
                  source={{
                    uri: selectedImage || getAccessibleImageUrl(profileData.selfieImageUrl),
                  }}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    borderRadius: 64,
                  }}
                  resizeMode="cover"
                />
              ) : (
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
            </TouchableOpacity>

            {/* Camera icon overlay */}
            <View
              style={{
                position: 'absolute',
                bottom: 12,
                right: 4,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#10b981',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2.5,
                borderColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Ionicons name="camera" size={18} color="white" />
            </View>
          </View>
        </View>

        {/* Name and ID */}
        <View className="items-center mb-6 mt-0">
          <Text className={`text-xl font-bold mb-1 ${isDarkTheme ? 'text-gray-100' : 'text-gray-800'}`}>
            {profileData?.name}
          </Text>
          <Text className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            ID: {(profileData?.id).toString().padStart(8, '0')}
          </Text>
        </View>

        {/* Form content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ gap: 16, paddingBottom: 32 }}>
          
            {/* User ID Display */}
            <View className={`rounded-2xl p-4 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <Text className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>User ID</Text>
              <Text className={`text-base font-medium ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                {(profileData?.id).toString().padStart(8, '0')}
              </Text>
            </View>

            {/* Full Name Input */}
            <View className={`rounded-2xl p-4 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <Text className={`font-medium mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>Name</Text>
              <Input
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                error={errors.name}
                className={isDarkTheme ? 'bg-gray-600' : 'bg-white'}
              />
            </View>

            {/* Phone Number Input */}
            <View className={`rounded-2xl p-4 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <Text className={`font-medium mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>Phone</Text>
              <Input
                value={formData.contactNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, contactNumber: text }))}
                placeholder="Enter your contact number"
                keyboardType="phone-pad"
                error={errors.contactNumber}
                className={isDarkTheme ? 'bg-gray-600' : 'bg-white'}
              />
            </View>

            {/* Email Display */}
            <View className={`rounded-2xl p-4 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <Text className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</Text>
              <Text className={`text-base font-medium ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                {profileData.email}
              </Text>
            </View>

            {/* Push Notifications Toggle */}
            <View className={`flex-row items-center justify-between rounded-2xl p-4 mb-2 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <Text className={`font-medium ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>Push Notifications</Text>
              <View className="w-12 h-7 bg-emerald-500 rounded-full" />
            </View>

            {/* Dark Theme Toggle */}
            <View className={`flex-row items-center justify-between rounded-2xl p-4 mb-6 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <Text className={`font-medium ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>Turn Dark Theme</Text>
              <TouchableOpacity
                onPress={toggleTheme}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: isDarkTheme ? '#10b981' : '#d1d5db',
                  justifyContent: 'center',
                  paddingHorizontal: 2,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: 'white',
                    marginLeft: isDarkTheme ? 22 : 0,
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Update Profile Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isUpdating}
              className={`py-4 rounded-full items-center ${
                isUpdating ? 'bg-gray-400' : 'bg-emerald-500'
              }`}
            >
              <Text className="text-white font-bold text-base">
                {isUpdating ? 'Updating Profile...' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}