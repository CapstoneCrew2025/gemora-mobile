import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../../../components/common/Input";
import { getAccessibleImageUrl } from "../../../lib/apiClient";
import { ProfileData, profileService, UpdateProfileRequest } from "../../../lib/profileService";

export default function EditProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    contactNumber: '',
  });

  // Load profile data
  useEffect(() => {
    loadProfile();
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
      
      // Update local state with the API response
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
      <View className="items-center justify-center flex-1" style={{ backgroundColor: '#f0fdf4' }}>
        <View className="items-center p-6 bg-white shadow-lg rounded-3xl">
          <Text className="text-lg font-semibold text-emerald-600">Loading...</Text>
        </View>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View className="items-center justify-center flex-1" style={{ backgroundColor: '#f0fdf4' }}>
        <View className="items-center p-6 bg-white shadow-lg rounded-3xl">
          <Text className="mb-4 text-lg font-semibold text-red-600">Failed to load profile</Text>
          <TouchableOpacity onPress={loadProfile} className="px-6 py-3 rounded-2xl bg-emerald-500">
            <Text className="font-semibold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#f0fdf4' }}>
      <Stack.Screen 
        options={{ 
          title: 'Edit Profile',
          headerStyle: { backgroundColor: '#10b981' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      {/* Header Section with Profile Picture */}
      <View className="relative px-6 pt-8 pb-8 bg-emerald-500">
        <View className="items-center p-6 mx-4 bg-white shadow-lg rounded-3xl" style={{ marginBottom: -50 }}>
          {/* Profile Picture Section */}
          <View className="items-center mb-4">
            <View className="relative">
              {(selectedImage || profileData.selfieImageUrl) ? (
                <Image 
                  source={{ 
                    uri: selectedImage || getAccessibleImageUrl(profileData.selfieImageUrl) 
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: '#e5e7eb',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 50 }}>👤</Text>
                </View>
              )}
              <TouchableOpacity 
                onPress={handleImagePicker}
                className="absolute bottom-0 right-0 items-center justify-center w-10 h-10 rounded-full bg-emerald-500 shadow-md"
              >
                <Text className="text-lg text-white">📷</Text>
              </TouchableOpacity>
            </View>
            {selectedImage && (
              <Text className="mt-2 text-sm font-medium text-emerald-600">✓ New image selected</Text>
            )}
          </View>
          <Text className="text-lg font-semibold text-gray-800">{profileData.name}</Text>
          <Text className="text-sm text-gray-500">ID: {profileData.id.toString().padStart(6, '0')}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" style={{ paddingTop: 60 }}>
        <View className="pb-6">
          {/* Form Fields */}
          <View style={{ gap: 16 }}>
            <View className="p-5 bg-white shadow-sm rounded-2xl">
              <Text className="mb-2 text-sm font-medium text-gray-500">User ID</Text>
              <Text className="text-base font-semibold text-gray-800">#{profileData.id.toString().padStart(6, '0')}</Text>
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-emerald-700">Full Name</Text>
              <Input
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                error={errors.name}
                className="bg-white shadow-sm"
              />
            </View>

            <View className="p-5 bg-white shadow-sm rounded-2xl">
              <Text className="mb-2 text-sm font-medium text-gray-500">Email</Text>
              <Text className="text-base font-medium text-gray-700">{profileData.email}</Text>
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-emerald-700">Contact Number</Text>
              <Input
                value={formData.contactNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, contactNumber: text }))}
                placeholder="Enter your contact number"
                keyboardType="phone-pad"
                error={errors.contactNumber}
                className="bg-white shadow-sm"
              />
            </View>

            <View className="p-5 bg-white shadow-sm rounded-2xl">
              <Text className="mb-2 text-sm font-medium text-gray-500">Role</Text>
              <Text className="text-base font-medium text-gray-700">{profileData.role}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isUpdating}
              className={`p-4 rounded-2xl items-center shadow-sm ${
                isUpdating ? 'bg-gray-400' : 'bg-emerald-500'
              }`}
            >
              <Text className="text-lg font-semibold text-white">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="items-center p-4 bg-white border border-emerald-200 rounded-2xl"
            >
              <Text className="font-semibold text-emerald-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}