// app/(main)/(home)/sellgem.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { gemService, CreateGemRequest } from '../../../lib/gemService';

const LISTING_TYPES = ['SALE', 'AUCTION'] as const;

export default function SellGem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    carat: '',
    origin: '',
    certificationNumber: '',
    price: '',
    listingType: 'SALE' as 'SALE' | 'AUCTION',
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Request permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Camera and media library permissions are required to upload images.');
      return false;
    }
    return true;
  };

  // Pick images from gallery
  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Image picker options
  const showImageOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImages },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter gem name');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Please enter description');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Validation Error', 'Please enter category');
      return false;
    }
    if (!formData.carat || parseFloat(formData.carat) <= 0) {
      Alert.alert('Validation Error', 'Please enter valid carat weight');
      return false;
    }
    if (!formData.origin.trim()) {
      Alert.alert('Validation Error', 'Please enter origin');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Validation Error', 'Please enter valid price');
      return false;
    }
    if (selectedImages.length < 3) {
      Alert.alert('Validation Error', 'Please select at least 3 images');
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestData: CreateGemRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        carat: parseFloat(formData.carat),
        origin: formData.origin.trim(),
        price: parseFloat(formData.price),
        listingType: formData.listingType,
        images: selectedImages,
      };

      if (formData.certificationNumber.trim()) {
        requestData.certificationNumber = formData.certificationNumber.trim();
      }

      const response = await gemService.createGemListing(requestData);

      Alert.alert(
        'Success',
        'Your gem has been listed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-emerald-500">
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-3xl text-white">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Sell Your Gem</Text>
        </View>
      </View>

      {/* Form Container */}
      <ScrollView className="flex-1 bg-gray-50 rounded-t-[40px] px-6 pt-6">
        {/* Gem Information Card */}
        <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Gem Information</Text>

          {/* Name */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Gem Name *</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
              placeholder="e.g., Blue Sapphire"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Description *</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
              placeholder="Describe your gem..."
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Category *</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
              placeholder="e.g., Sapphire, Ruby, Emerald"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
            />
          </View>

          {/* Carat and Origin Row */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-gray-700 font-semibold mb-2">Carat *</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                placeholder="2.5"
                value={formData.carat}
                onChangeText={(text) => setFormData({ ...formData, carat: text })}
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-gray-700 font-semibold mb-2">Origin *</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                placeholder="Sri Lanka"
                value={formData.origin}
                onChangeText={(text) => setFormData({ ...formData, origin: text })}
              />
            </View>
          </View>

          {/* Certification Number */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Certification Number</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
              placeholder="CERT-12345 (Optional)"
              value={formData.certificationNumber}
              onChangeText={(text) => setFormData({ ...formData, certificationNumber: text })}
            />
          </View>
        </View>

        {/* Pricing Card */}
        <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Pricing & Listing</Text>

          {/* Price */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Price *</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
              placeholder="1500"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Listing Type */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Listing Type</Text>
            <View className="flex-row">
              {LISTING_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`flex-1 mr-2 rounded-xl py-3 items-center ${
                    formData.listingType === type ? 'bg-emerald-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setFormData({ ...formData, listingType: type })}
                >
                  <Text
                    className={`font-semibold ${
                      formData.listingType === type ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Images Card */}
        <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">Gem Images *</Text>
          <Text className="text-sm text-gray-600 mb-4">
            Add at least 3 high-quality images ({selectedImages.length}/3 minimum)
          </Text>

          {/* Selected Images Grid */}
          {selectedImages.length > 0 && (
            <View className="flex-row flex-wrap mb-4">
              {selectedImages.map((uri, index) => (
                <View key={index} className="w-24 h-24 mr-2 mb-2 relative">
                  <Image source={{ uri }} className="w-full h-full rounded-xl" />
                  <TouchableOpacity
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                    onPress={() => removeImage(index)}
                  >
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add Image Button */}
          <TouchableOpacity
            className="bg-emerald-100 border-2 border-dashed border-emerald-500 rounded-xl py-4 items-center"
            onPress={showImageOptions}
          >
            <Text className="text-4xl mb-2">📷</Text>
            <Text className="text-emerald-600 font-semibold">Add Images</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`rounded-3xl py-4 items-center mb-6 ${
            loading ? 'bg-emerald-300' : 'bg-emerald-500'
          }`}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Submit Listing</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
