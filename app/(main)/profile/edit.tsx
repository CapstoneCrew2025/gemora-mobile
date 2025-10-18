import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../../../components/common/Input";
import { getAccessibleImageUrl } from "../../../lib/apiClient";
import { ProfileData, profileService } from "../../../lib/profileService";

export default function EditProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
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
        email: profile.email,
        contactNumber: profile.contactNumber,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors = { name: '', email: '', contactNumber: '' };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Contact number validation
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
      // TODO: Implement update API call when provided
      // await profileService.updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  }, [formData]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-red-600">Failed to load profile</Text>
        <TouchableOpacity onPress={loadProfile} className="mt-4">
          <Text className="text-emerald-500">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Edit Profile',
          headerStyle: { backgroundColor: '#10b981' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          {/* Profile Picture Section */}
          <View className="items-center mb-8">
            <View className="relative">
              {profileData.selfieImageUrl ? (
                <Image 
                  source={{ uri: getAccessibleImageUrl(profileData.selfieImageUrl) }}
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: 64,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{
                  width: 128,
                  height: 128,
                  borderRadius: 64,
                  backgroundColor: '#e5e7eb',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 60 }}>👤</Text>
                </View>
              )}
              <TouchableOpacity className="absolute bottom-0 right-0 bg-emerald-500 w-10 h-10 rounded-full items-center justify-center">
                <Text className="text-white text-lg">📷</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">User ID</Text>
              <View className="bg-gray-100 p-4 rounded-xl">
                <Text className="text-gray-600">#{profileData.id.toString().padStart(6, '0')}</Text>
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
              <Input
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                error={errors.name}
                className="bg-white"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <Input
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                className="bg-white"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Contact Number</Text>
              <Input
                value={formData.contactNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, contactNumber: text }))}
                placeholder="Enter your contact number"
                keyboardType="phone-pad"
                error={errors.contactNumber}
                className="bg-white"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Role</Text>
              <View className="bg-gray-100 p-4 rounded-xl">
                <Text className="text-gray-600">{profileData.role}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-8 space-y-4">
            <TouchableOpacity
              onPress={handleSave}
              disabled={isUpdating}
              className={`p-4 rounded-xl items-center ${
                isUpdating ? 'bg-gray-400' : 'bg-emerald-500'
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="p-4 rounded-xl items-center border border-gray-300"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}