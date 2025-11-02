import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAccessibleImageUrl } from '../../lib/apiClient';
import { ApprovedGem, gemMarketService } from '../../lib/gemMarketService';

export default function Marketplace() {
  const [gems, setGems] = useState<ApprovedGem[]>([]);
  const [filteredGems, setFilteredGems] = useState<ApprovedGem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedListingType, setSelectedListingType] = useState<string>('All');

  const categories = ['All', 'Ruby', 'Sapphire', 'Emerald', 'Diamond', 'Other'];
  const listingTypes = ['All', 'SALE', 'AUCTION'];

  useEffect(() => {
    fetchGems();
  }, []);

  useEffect(() => {
    filterGems();
  }, [gems, searchQuery, selectedCategory, selectedListingType]);

  const fetchGems = async () => {
    try {
      setLoading(true);
      const data = await gemMarketService.getApprovedGems();
      setGems(data);
    } catch (error) {
      console.error('Error fetching gems:', error);
      Alert.alert('Error', 'Failed to load marketplace gems. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGems();
    setRefreshing(false);
  };

  const filterGems = () => {
    let filtered = [...gems];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (gem) =>
          gem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gem.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((gem) => gem.category === selectedCategory);
    }

    // Filter by listing type
    if (selectedListingType !== 'All') {
      filtered = filtered.filter((gem) => gem.listingType === selectedListingType);
    }

    setFilteredGems(filtered);
  };

  const handleGemPress = (gemId: number) => {
    router.push(`/(main)/gemdetail?id=${gemId}`);
  };

  const renderGemCard = (gem: ApprovedGem) => {
    const imageUrl = gem.imageUrls && gem.imageUrls.length > 0 ? getAccessibleImageUrl(gem.imageUrls[0]) : null;

    return (
      <TouchableOpacity
        key={gem.id}
        className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
        onPress={() => handleGemPress(gem.id)}
      >
        {/* Gem Image */}
        <View className="h-48 bg-gray-200">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="diamond-outline" size={60} color="#d1d5db" />
            </View>
          )}
        </View>

        {/* Gem Info */}
        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={1}>
              {gem.name}
            </Text>
            <View
              className={`px-2 py-1 rounded-full ${
                gem.listingType === 'AUCTION' ? 'bg-purple-100' : 'bg-emerald-100'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  gem.listingType === 'AUCTION' ? 'text-purple-600' : 'text-emerald-600'
                }`}
              >
                {gem.listingType}
              </Text>
            </View>
          </View>

          <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
            {gem.description}
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1">{gem.origin}</Text>
            <Text className="text-sm text-gray-400 mx-2">•</Text>
            <Text className="text-sm text-gray-600">{gem.carat} ct</Text>
          </View>

          {gem.certificationNumber && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark-outline" size={16} color="#10b981" />
              <Text className="text-xs text-emerald-600 ml-1">Certified</Text>
            </View>
          )}

          <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-emerald-600">
                ${gem.price.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-emerald-500 px-4 py-2 rounded-lg"
              onPress={() => handleGemPress(gem.id)}
            >
              <Text className="text-white font-semibold">View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-600 mt-4">Loading marketplace...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Marketplace</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
          <Ionicons name="search-outline" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search gems..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedCategory === category ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                className={`font-semibold ${
                  selectedCategory === category ? 'text-white' : 'text-gray-700'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Listing Type Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {listingTypes.map((type) => (
            <TouchableOpacity
              key={type}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedListingType === type ? 'bg-purple-500' : 'bg-gray-200'
              }`}
              onPress={() => setSelectedListingType(type)}
            >
              <Text
                className={`font-semibold ${
                  selectedListingType === type ? 'text-white' : 'text-gray-700'
                }`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Gems List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10b981']}
            tintColor="#10b981"
          />
        }
      >
        {filteredGems.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="diamond-outline" size={80} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4">No gems found</Text>
            <Text className="text-gray-400 text-sm mt-2">Try adjusting your filters</Text>
          </View>
        ) : (
          <>
            <Text className="text-sm text-gray-600 mb-4">
              {filteredGems.length} {filteredGems.length === 1 ? 'gem' : 'gems'} available
            </Text>
            {filteredGems.map(renderGemCard)}
          </>
        )}
      </ScrollView>
    </View>
  );
}