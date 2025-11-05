import { getAccessibleImageUrl } from '@/lib/apiClient';
import gemMarketService from '@/lib/gemMarketService';
import gemService from '@/lib/gemService';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

interface Certificate {
  issuer: string;
  certificateNo: string;
  issuedDate: string;
  file?: any;
}

export default function EditGemScreen() {
  const { gemId } = useLocalSearchParams<{ gemId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [color, setColor] = useState('');
  const [clarity, setClarity] = useState('');
  const [origin, setOrigin] = useState('');
  const [price, setPrice] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [newImages, setNewImages] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    loadGemData();
  }, [gemId]);

  const loadGemData = async () => {
    try {
      setLoading(true);
      const gem = await gemMarketService.getGemById(Number(gemId));
      
      // Populate form fields
      setName(gem.name);
      setDescription(gem.description);
      setWeight(gem.carat.toString());
      setColor(''); // Color not in response, keep empty
      setClarity(''); // Clarity not in response, keep empty
      setOrigin(gem.origin);
      setPrice(gem.price.toString());
      setExistingImages(gem.imageUrls || []);
      
      // Populate certificates if they exist
      if (gem.certificates && gem.certificates.length > 0) {
        setCertificates(gem.certificates.map((cert: any) => ({
          issuer: cert.issuingAuthority,
          certificateNo: cert.certificateNumber,
          issuedDate: cert.issueDate,
        })));
      }
    } catch (error: any) {
      console.error('Error loading gem:', error);
      Alert.alert('Error', 'Failed to load gem details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setNewImages([...newImages, ...result.assets]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      { issuer: '', certificateNo: '', issuedDate: '', file: null },
    ]);
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const updateCertificate = (index: number, field: keyof Certificate, value: any) => {
    const updated = [...certificates];
    updated[index] = { ...updated[index], [field]: value };
    setCertificates(updated);
  };

  const pickCertificateFile = async (index: number) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateCertificate(index, 'file', result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking certificate:', error);
      Alert.alert('Error', 'Failed to pick certificate file');
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter gem name');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter description');
      return false;
    }
    if (!weight.trim() || isNaN(Number(weight))) {
      Alert.alert('Validation Error', 'Please enter valid weight');
      return false;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Validation Error', 'Please enter valid price');
      return false;
    }
    if (!origin.trim()) {
      Alert.alert('Validation Error', 'Please enter origin');
      return false;
    }

    // Validate certificates
    for (const cert of certificates) {
      if (!cert.issuer.trim() || !cert.certificateNo.trim() || !cert.issuedDate.trim()) {
        Alert.alert('Validation Error', 'Please fill all certificate fields or remove empty certificates');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const updateData = {
        name: name.trim(),
        description: description.trim(),
        weight: Number(weight),
        color: color.trim(),
        clarity: clarity.trim(),
        origin: origin.trim(),
        price: Number(price),
        status: 'PENDING' as const,
        certificates: certificates.map(cert => ({
          issuer: cert.issuer.trim(),
          certificateNo: cert.certificateNo.trim(),
          issuedDate: cert.issuedDate.trim(),
        })),
        images: newImages.length > 0 ? newImages : undefined,
      };

      await gemService.updateGemListing(Number(gemId), updateData);

      Alert.alert(
        'Success',
        'Your gem has been updated and submitted for review',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error updating gem:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update gem listing'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="mt-4 text-gray-600">Loading gem details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Edit Gem Listing</Text>
          <Text className="mt-1 text-sm text-gray-600">
            Update your gem details and resubmit for review
          </Text>
        </View>

        {/* Basic Information */}
        <View className="p-4 mb-4 bg-white rounded-lg shadow-sm">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Basic Information</Text>

          <Text className="mb-1 text-sm font-medium text-gray-700">Gem Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Blue Sapphire"
            className="p-3 mb-4 border border-gray-300 rounded-lg"
          />

          <Text className="mb-1 text-sm font-medium text-gray-700">Description *</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your gem..."
            multiline
            numberOfLines={4}
            className="p-3 mb-4 border border-gray-300 rounded-lg"
            textAlignVertical="top"
          />

          <View className="flex-row mb-4 space-x-2">
            <View className="flex-1 mr-2">
              <Text className="mb-1 text-sm font-medium text-gray-700">Weight (ct) *</Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="5.0"
                keyboardType="decimal-pad"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-sm font-medium text-gray-700">Price ($) *</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="5000"
                keyboardType="decimal-pad"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </View>
          </View>

          <Text className="mb-1 text-sm font-medium text-gray-700">Color</Text>
          <TextInput
            value={color}
            onChangeText={setColor}
            placeholder="e.g., Deep Blue"
            className="p-3 mb-4 border border-gray-300 rounded-lg"
          />

          <Text className="mb-1 text-sm font-medium text-gray-700">Clarity</Text>
          <TextInput
            value={clarity}
            onChangeText={setClarity}
            placeholder="e.g., VS1, VVS"
            className="p-3 mb-4 border border-gray-300 rounded-lg"
          />

          <Text className="mb-1 text-sm font-medium text-gray-700">Origin *</Text>
          <TextInput
            value={origin}
            onChangeText={setOrigin}
            placeholder="e.g., Sri Lanka"
            className="p-3 border border-gray-300 rounded-lg"
          />
        </View>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <View className="p-4 mb-4 bg-white rounded-lg shadow-sm">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Current Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {existingImages.map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: getAccessibleImageUrl(imageUrl) }}
                  className="w-24 h-24 mr-2 rounded-lg"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <Text className="mt-2 text-xs text-gray-500">
              Note: Adding new images below will replace these images
            </Text>
          </View>
        )}

        {/* New Images */}
        <View className="p-4 mb-4 bg-white rounded-lg shadow-sm">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Add New Images (Optional)</Text>
          
          {newImages.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              {newImages.map((image, index) => (
                <View key={index} className="mr-2">
                  <Image
                    source={{ uri: image.uri }}
                    className="w-24 h-24 rounded-lg"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeNewImage(index)}
                    className="absolute bg-red-500 rounded-full -top-2 -right-2"
                  >
                    <Ionicons name="close-circle" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            onPress={pickImages}
            className="flex-row items-center justify-center p-3 border-2 border-dashed rounded-lg border-emerald-500"
          >
            <Ionicons name="images-outline" size={24} color="#059669" />
            <Text className="ml-2 font-medium text-emerald-600">Add New Images</Text>
          </TouchableOpacity>
        </View>

        {/* Certificates */}
        <View className="p-4 mb-4 bg-white rounded-lg shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-800">Certificates</Text>
            <TouchableOpacity
              onPress={addCertificate}
              className="flex-row items-center px-3 py-1 rounded-lg bg-emerald-100"
            >
              <Ionicons name="add-circle-outline" size={20} color="#059669" />
              <Text className="ml-1 text-sm font-medium text-emerald-600">Add</Text>
            </TouchableOpacity>
          </View>

          {certificates.map((cert, index) => (
            <View key={index} className="p-3 mb-3 border border-gray-200 rounded-lg">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-medium text-gray-700">Certificate {index + 1}</Text>
                <TouchableOpacity onPress={() => removeCertificate(index)}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <TextInput
                value={cert.issuer}
                onChangeText={(text) => updateCertificate(index, 'issuer', text)}
                placeholder="Issuer (e.g., GIA)"
                className="p-2 mb-2 border border-gray-300 rounded"
              />

              <TextInput
                value={cert.certificateNo}
                onChangeText={(text) => updateCertificate(index, 'certificateNo', text)}
                placeholder="Certificate Number"
                className="p-2 mb-2 border border-gray-300 rounded"
              />

              <TextInput
                value={cert.issuedDate}
                onChangeText={(text) => updateCertificate(index, 'issuedDate', text)}
                placeholder="Issued Date (YYYY-MM-DD)"
                className="p-2 mb-2 border border-gray-300 rounded"
              />

              <TouchableOpacity
                onPress={() => pickCertificateFile(index)}
                className="flex-row items-center p-2 border border-gray-300 rounded"
              >
                <Ionicons name="document-attach-outline" size={20} color="#059669" />
                <Text className="ml-2 text-sm text-gray-600">
                  {cert.file ? cert.file.name : 'Attach Certificate File (Optional)'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {certificates.length === 0 && (
            <Text className="text-sm text-center text-gray-500">
              No certificates added yet. Tap "Add" to include certificates.
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          className={`p-4 mb-6 rounded-lg ${submitting ? 'bg-gray-400' : 'bg-emerald-500'}`}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-center text-white">
              Update & Submit for Review
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
