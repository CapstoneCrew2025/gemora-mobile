// app/(main)/(home)/sellgem.tsx
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CreateGemRequest, gemService } from '../../../lib/gemService';

const LISTING_TYPES = ['SALE', 'AUCTION'] as const;

export default function SellGem() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    carat: '',
    origin: '',
    price: '',
    listingType: 'SALE' as 'SALE' | 'AUCTION',
    // Certificate fields
    certificateNumber: '',
    issuingAuthority: '',
    issueDate: '',
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [certificateFile, setCertificateFile] = useState<string | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string>('');
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

  // Pick certificate document
  const pickCertificateFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setCertificateFile(result.assets[0].uri);
        setCertificateFileName(result.assets[0].name);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  // Remove certificate file
  const removeCertificateFile = () => {
    setCertificateFile(null);
    setCertificateFileName('');
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

  // Validate Step 1: Gem Information
  const validateStep1 = (): boolean => {
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
    return true;
  };

  // Validate Step 2: Pricing & Listing
  const validateStep2 = (): boolean => {
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Validation Error', 'Please enter valid price');
      return false;
    }
    return true;
  };

  // Validate Step 3: Images
  const validateStep3 = (): boolean => {
    if (selectedImages.length < 3) {
      Alert.alert('Validation Error', 'Please select at least 3 images');
      return false;
    }
    return true;
  };

  // Step 4 validation is optional - user can skip
  const validateStep4 = (): boolean => {
    // Certificate is optional, so always return true
    return true;
  };

  // Handle Next button
  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    }
  };

  // Handle Back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Submit form
  const handleSubmit = async () => {
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

      // Add certificate data if provided
      if (formData.certificateNumber.trim()) {
        requestData.certificateNumber = formData.certificateNumber.trim();
      }
      
      if (formData.issuingAuthority.trim()) {
        requestData.issuingAuthority = formData.issuingAuthority.trim();
      }
      
      if (formData.issueDate.trim()) {
        requestData.issueDate = formData.issueDate.trim();
      }
      
      if (certificateFile) {
        requestData.certificateFile = certificateFile;
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

  // Render Step Indicator
  const renderStepIndicator = () => (
    <View className="flex-row justify-between px-2 mb-6">
      {[1, 2, 3, 4].map((step) => (
        <View key={step} className="items-center flex-1">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              currentStep >= step ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <Text className={`font-bold ${currentStep >= step ? 'text-white' : 'text-gray-600'}`}>
              {step}
            </Text>
          </View>
          <Text className={`text-xs mt-1 text-center ${currentStep === step ? 'text-emerald-600 font-semibold' : 'text-gray-500'}`}>
            {step === 1 ? 'Info' : step === 2 ? 'Price' : step === 3 ? 'Images' : 'Cert'}
          </Text>
          {step < 4 && (
            <View
              className={`absolute top-5 left-[60%] w-full h-0.5 ${
                currentStep > step ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-emerald-500">
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <Text className="text-3xl text-white">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Sell Your Gem</Text>
        </View>
        
        {/* Step Indicator */}
        {renderStepIndicator()}
      </View>

      {/* Form Container */}
      <View className="flex-1 bg-gray-50 rounded-t-[40px]">
        <ScrollView className="flex-1 px-6 pt-6">
          {/* Step 1: Gem Information */}
          {currentStep === 1 && (
            <View className="p-6 mb-4 bg-white shadow-sm rounded-3xl">
              <Text className="mb-2 text-xl font-bold text-gray-800">Gem Information</Text>
              <Text className="mb-6 text-sm text-gray-500">Tell us about your precious gem</Text>

              {/* Name */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Gem Name *</Text>
                <TextInput
                  className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                  placeholder="e.g., Blue Sapphire"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Description *</Text>
                <TextInput
                  className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                  placeholder="Describe your gem..."
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Category */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Category *</Text>
                <TextInput
                  className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                  placeholder="e.g., Sapphire, Ruby, Emerald"
                  value={formData.category}
                  onChangeText={(text) => setFormData({ ...formData, category: text })}
                />
              </View>

              {/* Carat and Origin Row */}
              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className="mb-2 font-semibold text-gray-700">Carat *</Text>
                  <TextInput
                    className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                    placeholder="2.5"
                    value={formData.carat}
                    onChangeText={(text) => setFormData({ ...formData, carat: text })}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="mb-2 font-semibold text-gray-700">Origin *</Text>
                  <TextInput
                    className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                    placeholder="Sri Lanka"
                    value={formData.origin}
                    onChangeText={(text) => setFormData({ ...formData, origin: text })}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Step 2: Pricing & Listing */}
          {currentStep === 2 && (
            <View className="p-6 mb-4 bg-white shadow-sm rounded-3xl">
              <Text className="mb-2 text-xl font-bold text-gray-800">Pricing & Listing</Text>
              <Text className="mb-6 text-sm text-gray-500">Set your price and listing type</Text>

              {/* Price */}
              <View className="mb-6">
                <Text className="mb-2 font-semibold text-gray-700">Price (LKR) *</Text>
                <View className="flex-row items-center px-4 py-3 bg-gray-100 rounded-xl">
                  <Text className="mr-2 text-lg text-gray-500">Rs.</Text>
                  <TextInput
                    className="flex-1 text-lg text-gray-800"
                    placeholder="1500.00"
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Listing Type */}
              <View className="mb-4">
                <Text className="mb-3 font-semibold text-gray-700">Listing Type *</Text>
                <View className="flex-row gap-3">
                  {LISTING_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      className={`flex-1 rounded-xl py-4 items-center border-2 ${
                        formData.listingType === type
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'bg-white border-gray-300'
                      }`}
                      onPress={() => setFormData({ ...formData, listingType: type })}
                    >
                      <Text className="mb-2 text-2xl">{type === 'SALE' ? '🏷️' : '⚡'}</Text>
                      <Text
                        className={`font-semibold ${
                          formData.listingType === type ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {type}
                      </Text>
                      <Text
                        className={`text-xs mt-1 ${
                          formData.listingType === type ? 'text-white/80' : 'text-gray-500'
                        }`}
                      >
                        {type === 'SALE' ? 'Fixed Price' : 'Bidding'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Step 3: Gem Images */}
          {currentStep === 3 && (
            <View className="p-6 mb-4 bg-white shadow-sm rounded-3xl">
              <Text className="mb-2 text-xl font-bold text-gray-800">Gem Images</Text>
              <Text className="mb-4 text-sm text-gray-500">
                Add at least 3 high-quality images
              </Text>

              {/* Image Counter */}
              <View className="flex-row items-center justify-between p-3 mb-4 bg-emerald-50 rounded-xl">
                <View className="flex-row items-center">
                  <Text className="mr-2 text-2xl">📸</Text>
                  <Text className="font-medium text-gray-700">
                    {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    selectedImages.length >= 3 ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      selectedImages.length >= 3 ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {selectedImages.length}/3 min
                  </Text>
                </View>
              </View>

              {/* Selected Images Grid */}
              {selectedImages.length > 0 && (
                <View className="flex-row flex-wrap mb-4">
                  {selectedImages.map((uri, index) => (
                    <View key={index} className="relative w-24 h-24 mb-2 mr-2">
                      <Image source={{ uri }} className="w-full h-full rounded-xl" />
                      <TouchableOpacity
                        className="absolute items-center justify-center w-6 h-6 bg-red-500 rounded-full shadow-md -top-2 -right-2"
                        onPress={() => removeImage(index)}
                      >
                        <Text className="text-xs font-bold text-white">✕</Text>
                      </TouchableOpacity>
                      <View className="absolute bottom-1 left-1 bg-black/50 rounded px-1.5 py-0.5">
                        <Text className="text-xs font-bold text-white">{index + 1}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Add Image Button */}
              <TouchableOpacity
                className="items-center py-6 border-2 border-dashed bg-emerald-100 border-emerald-500 rounded-xl"
                onPress={showImageOptions}
              >
                <Text className="mb-2 text-5xl">📷</Text>
                <Text className="text-base font-bold text-emerald-600">Add More Images</Text>
                <Text className="mt-1 text-xs text-gray-500">Camera or Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 4: Certificate (Optional) */}
          {currentStep === 4 && (
            <View className="p-6 mb-4 bg-white shadow-sm rounded-3xl">
              <Text className="mb-2 text-xl font-bold text-gray-800">Certificate Details</Text>
              <Text className="mb-2 text-sm text-gray-500">
                Add certificate information (Optional)
              </Text>
              
              {/* Optional Badge */}
              <View className="flex-row items-center px-3 py-2 mb-4 rounded-lg bg-amber-50">
                <Text className="mr-2 text-lg">ℹ️</Text>
                <Text className="flex-1 text-xs text-gray-600">
                  You can skip this step and submit your listing without certificate
                </Text>
              </View>

              {/* Certificate Number */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Certificate Number</Text>
                <TextInput
                  className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                  placeholder="e.g., GIA-2025-7788"
                  value={formData.certificateNumber}
                  onChangeText={(text) => setFormData({ ...formData, certificateNumber: text })}
                />
              </View>

              {/* Issuing Authority */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Issuing Authority</Text>
                <TextInput
                  className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                  placeholder="e.g., GIA Lab, IGI"
                  value={formData.issuingAuthority}
                  onChangeText={(text) => setFormData({ ...formData, issuingAuthority: text })}
                />
              </View>

              {/* Issue Date */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Issue Date</Text>
                <TextInput
                  className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                  placeholder="YYYY-MM-DD (e.g., 2025-01-20)"
                  value={formData.issueDate}
                  onChangeText={(text) => setFormData({ ...formData, issueDate: text })}
                />
              </View>

              {/* Certificate File Upload */}
              <View className="mb-4">
                <Text className="mb-3 font-semibold text-gray-700">Certificate File</Text>
                
                {certificateFile ? (
                  <View className="flex-row items-center justify-between p-4 border-2 border-emerald-500 bg-emerald-50 rounded-xl">
                    <View className="flex-row items-center flex-1">
                      <Text className="mr-2 text-2xl">📄</Text>
                      <View className="flex-1">
                        <Text className="font-medium text-gray-800" numberOfLines={1}>
                          {certificateFileName}
                        </Text>
                        <Text className="text-xs text-gray-500">PDF or Image</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="p-2 bg-red-500 rounded-full"
                      onPress={removeCertificateFile}
                    >
                      <Text className="text-xs font-bold text-white">✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="items-center py-6 border-2 border-gray-300 border-dashed bg-gray-50 rounded-xl"
                    onPress={pickCertificateFile}
                  >
                    <Text className="mb-2 text-4xl">📎</Text>
                    <Text className="text-base font-bold text-gray-700">Upload Certificate</Text>
                    <Text className="mt-1 text-xs text-gray-500">PDF or Image file</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View className="px-6 py-4 bg-white border-t border-gray-200">
          <View className="flex-row gap-3">
            {currentStep > 1 && (
              <TouchableOpacity
                className="items-center flex-1 py-4 bg-gray-200 rounded-2xl"
                onPress={handleBack}
              >
                <Text className="text-base font-bold text-gray-700">Previous</Text>
              </TouchableOpacity>
            )}
            
            {currentStep < 4 ? (
              <TouchableOpacity
                className={`${currentStep === 1 ? 'flex-1' : 'flex-1'} bg-emerald-500 rounded-2xl py-4 items-center`}
                onPress={handleNext}
              >
                <Text className="text-base font-bold text-white">Next Step</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  className="items-center flex-1 py-4 border-2 bg-gray-50 border-emerald-500 rounded-2xl"
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text className="text-base font-bold text-emerald-600">Skip & Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 rounded-2xl py-4 items-center ${
                    loading ? 'bg-emerald-300' : 'bg-emerald-500'
                  }`}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-base font-bold text-white">Submit Listing</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
