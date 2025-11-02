import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getAccessibleImageUrl } from '../../lib/apiClient';
import { ApprovedGem, gemMarketService } from '../../lib/gemMarketService';

const { width } = Dimensions.get('window');

export default function GemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [gem, setGem] = useState<ApprovedGem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchGemDetails();
    }
  }, [id]);

  const fetchGemDetails = async () => {
    try {
      setLoading(true);
      const data = await gemMarketService.getGemById(Number(id));
      setGem(data);
    } catch (error) {
      console.error('Error fetching gem details:', error);
      Alert.alert('Error', 'Failed to load gem details. Please try again.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (!gem) return;
    Alert.alert(
      'Contact Seller',
      `Contact seller #${gem.sellerId} about ${gem.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => console.log('Message sent') },
      ]
    );
  };

  const handlePlaceBid = () => {
    if (!gem) return;
    Alert.alert(
      'Place Bid',
      `Place a bid on ${gem.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Place Bid', onPress: () => console.log('Bid placed') },
      ]
    );
  };

  const handleBuyNow = () => {
    if (!gem) return;
    Alert.alert(
      'Buy Now',
      `Purchase ${gem.name} for $${gem.price.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm Purchase', onPress: () => console.log('Purchase confirmed') },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-600 mt-4">Loading gem details...</Text>
      </View>
    );
  }

  if (!gem) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Ionicons name="diamond-outline" size={80} color="#d1d5db" />
        <Text className="text-gray-500 text-lg mt-4">Gem not found</Text>
        <TouchableOpacity
          className="mt-4 bg-emerald-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-4 pt-12 pb-4">
        <TouchableOpacity
          className="bg-white/80 rounded-full p-2"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-white/80 rounded-full p-2">
          <Ionicons name="heart-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Image Gallery */}
        <View className="bg-gray-100">
          {gem.imageUrls && gem.imageUrls.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / width
                  );
                  setSelectedImageIndex(index);
                }}
                scrollEventThrottle={16}
              >
                {gem.imageUrls.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: getAccessibleImageUrl(url) }}
                    style={{ width, height: 400 }}
                    resizeMode="cover"
                    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                  />
                ))}
              </ScrollView>
              {gem.imageUrls.length > 1 && (
                <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
                  {gem.imageUrls.map((_, index) => (
                    <View
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View className="items-center justify-center" style={{ width, height: 400 }}>
              <Ionicons name="diamond-outline" size={100} color="#d1d5db" />
            </View>
          )}
        </View>

        {/* Gem Details */}
        <View className="p-4">
          {/* Title and Price */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-gray-800 mb-1">
                {gem.name}
              </Text>
              <View
                className={`self-start px-3 py-1 rounded-full ${
                  gem.listingType === 'AUCTION' ? 'bg-purple-100' : 'bg-emerald-100'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    gem.listingType === 'AUCTION' ? 'text-purple-600' : 'text-emerald-600'
                  }`}
                >
                  {gem.listingType === 'AUCTION' ? 'Auction' : 'For Sale'}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-sm text-gray-500">
                {gem.listingType === 'AUCTION' ? 'Current Bid' : 'Price'}
              </Text>
              <Text className="text-3xl font-bold text-emerald-600">
                ${gem.price.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Category Badge */}
          <View className="bg-gray-100 self-start px-3 py-1 rounded-full mb-4">
            <Text className="text-sm font-medium text-gray-700">{gem.category}</Text>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Description</Text>
            <Text className="text-gray-600 leading-6">{gem.description}</Text>
          </View>

          {/* Specifications */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Specifications</Text>
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                <Text className="text-gray-600">Carat Weight</Text>
                <Text className="font-semibold text-gray-800">{gem.carat} ct</Text>
              </View>
              <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                <Text className="text-gray-600">Origin</Text>
                <Text className="font-semibold text-gray-800">{gem.origin}</Text>
              </View>
              <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                <Text className="text-gray-600">Category</Text>
                <Text className="font-semibold text-gray-800">{gem.category}</Text>
              </View>
              {gem.certificationNumber && (
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-gray-600">Certification</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                    <Text className="font-semibold text-emerald-600 ml-1">
                      {gem.certificationNumber}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Certificates */}
          {gem.certificates && gem.certificates.length > 0 && (
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Certificates</Text>
              {gem.certificates.map((cert) => (
                <View key={cert.id} className="bg-emerald-50 rounded-lg p-4 mb-2">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-800 mb-1">
                        {cert.certificateNumber}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {cert.issuingAuthority}
                      </Text>
                    </View>
                    {cert.verified && (
                      <View className="bg-emerald-500 px-2 py-1 rounded-full">
                        <Text className="text-xs text-white font-semibold">Verified</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-gray-500">
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </Text>
                  {cert.fileUrl && (
                    <TouchableOpacity className="mt-2">
                      <Text className="text-emerald-600 font-semibold">
                        View Certificate →
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Listing Info */}
          <View className="bg-gray-50 rounded-lg p-4 mb-4">
            <Text className="text-sm text-gray-500 mb-1">Listed on</Text>
            <Text className="text-gray-800">
              {new Date(gem.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="border-t border-gray-200 p-4 bg-white">
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="flex-1 bg-gray-100 py-3 rounded-lg mr-2"
            onPress={handleContactSeller}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="chatbubble-outline" size={20} color="#1f2937" />
              <Text className="text-gray-800 font-semibold ml-2">Contact Seller</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-emerald-500 py-3 rounded-lg"
            onPress={gem.listingType === 'AUCTION' ? handlePlaceBid : handleBuyNow}
          >
            <Text className="text-white font-bold text-center">
              {gem.listingType === 'AUCTION' ? 'Place Bid' : 'Buy Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
