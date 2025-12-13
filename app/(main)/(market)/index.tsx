import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
import { useTheme } from '../../../context/ThemeContext';
import { getAccessibleImageUrl } from '../../../lib/apiClient';
import { ApprovedGem, gemMarketService } from '../../../lib/gemMarketService';

export default function Marketplace() {
  const [gems, setGems] = useState<ApprovedGem[]>([]);
  const [filteredGems, setFilteredGems] = useState<ApprovedGem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedListingType, setSelectedListingType] = useState<string>('All');
  const { theme } = useTheme();

  const styles = useMemo(() => ({
    background: { backgroundColor: theme.colors.background },
    card: { backgroundColor: theme.colors.card },
    text: { color: theme.colors.text },
    subtext: { color: theme.colors.subtext },
    border: { borderColor: theme.colors.border },
    primary: { backgroundColor: theme.colors.primary },
    input: { backgroundColor: theme.colors.card },
    header: { backgroundColor: theme.colors.primary },
  }), [theme]);

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
    router.push(`./gemdetail?id=${gemId}`);
  };

  const renderGemCard = (gem: ApprovedGem) => {
    const imageUrl = gem.imageUrls && gem.imageUrls.length > 0 ? getAccessibleImageUrl(gem.imageUrls[0]) : null;
    const isAuction = gem.listingType === 'AUCTION';

    return (
      <TouchableOpacity
        key={gem.id}
        className="mb-4 overflow-hidden rounded-lg shadow-md"
        style={styles.card}
        onPress={() => handleGemPress(gem.id)}
      >
        {/* Gem Image */}
        <View className="h-48" style={[styles.card, styles.border, { borderBottomWidth: 1 }]}> 
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
          ) : (
            <View className="items-center justify-center flex-1">
              <Ionicons name="diamond-outline" size={60} color={theme.colors.subtext} />
            </View>
          )}
        </View>

        {/* Gem Info */}
        <View className="p-4">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="flex-1 text-lg font-bold" style={styles.text} numberOfLines={1}>
              {gem.name}
            </Text>
            <View
              className="px-2 py-1 rounded-full"
              style={isAuction ? { backgroundColor: `${theme.colors.primary}22` } : { backgroundColor: `${theme.colors.primary}22` }}
            >
              <Text className="text-xs font-semibold" style={{ color: theme.colors.primary }}>
                {gem.listingType}
              </Text>
            </View>
          </View>

          <Text className="mb-2 text-sm" style={styles.subtext} numberOfLines={2}>
            {gem.description}
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={16} color={theme.colors.subtext} />
            <Text className="ml-1 text-sm" style={styles.subtext}>{gem.origin}</Text>
            <Text className="mx-2 text-sm" style={styles.subtext}>•</Text>
            <Text className="text-sm" style={styles.subtext}>{gem.carat} ct</Text>
          </View>

          {gem.certificationNumber && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.primary} />
              <Text className="ml-1 text-xs" style={{ color: theme.colors.primary }}>Certified</Text>
            </View>
          )}

          <View className="flex-row items-center justify-between pt-2 mt-2 border-t" style={[styles.border]}> 
            <View className="flex-row items-center">
              <Text className="text-xl font-bold" style={{ color: theme.colors.primary }}>
                ${gem.price.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              style={styles.primary}
              onPress={() => handleGemPress(gem.id)}
            >
              <Text className="font-semibold text-white">View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1" style={styles.background}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text className="mt-4" style={styles.subtext}>Loading marketplace...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={styles.header}>
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-2xl font-bold text-white">Marketplace</Text>
        <Text className="text-sm text-white/90">Discover and Trade Gems</Text>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 rounded-t-[40px]" style={styles.background}>
        <View className="px-4 pt-6">
          {/* Search Bar */}
          <View className="flex-row items-center px-3 py-2 mb-3 rounded-lg" style={[styles.input, styles.border, { borderWidth: 1 }]}> 
            <Ionicons name="search-outline" size={20} color={theme.colors.subtext} />
            <TextInput
              className="flex-1 ml-2"
              style={styles.text}
              placeholder="Search gems..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.subtext}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.subtext} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className="px-4 py-2 mr-2 rounded-full"
                style={selectedCategory === category
                  ? [styles.primary]
                  : [styles.card, styles.border, { borderWidth: 1 }]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text className="font-semibold" style={selectedCategory === category ? { color: '#fff' } : styles.text}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Listing Type Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {listingTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className="px-4 py-2 mr-2 rounded-full"
                style={selectedListingType === type
                  ? [styles.primary]
                  : [styles.card, styles.border, { borderWidth: 1 }]}
                onPress={() => setSelectedListingType(type)}
              >
                <Text className="font-semibold" style={selectedListingType === type ? { color: '#fff' } : styles.text}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Gems List */}
        <ScrollView
          className="flex-1 px-4"
          refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {filteredGems.length === 0 ? (
          <View className="items-center justify-center flex-1 py-20">
            <Ionicons name="diamond-outline" size={80} color={theme.colors.subtext} />
            <Text className="mt-4 text-lg" style={styles.text}>No gems found</Text>
            <Text className="mt-2 text-sm" style={styles.subtext}>Try adjusting your filters</Text>
          </View>
        ) : (
          <>
            <Text className="mb-4 text-sm" style={styles.subtext}>
              {filteredGems.length} {filteredGems.length === 1 ? 'gem' : 'gems'} available
            </Text>
            {filteredGems.map(renderGemCard)}
          </>
        )}
      </ScrollView>
      </View>
    </View>
  );
}
