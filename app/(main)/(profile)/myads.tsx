import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getAccessibleImageUrl } from '../../../lib/apiClient';
import { ApprovedGem, gemMarketService } from '../../../lib/gemMarketService';
import { profileService } from '../../../lib/profileService';

export default function MyAds() {
  const [gems, setGems] = useState<ApprovedGem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyGems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gemMarketService.getMyGems();
      setGems(data);
    } catch (error) {
      console.error('Error fetching my gems:', error);
      Alert.alert('Error', 'Failed to load your gems. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMyGems();
    }, [fetchMyGems])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyGems();
    setRefreshing(false);
  };

  const handleGemPress = (gemId: number) => {
    router.push(`/(main)/(market)/gemdetail?id=${gemId}`);
  };

  const handleEditGem = (gem: ApprovedGem) => {
    // Navigate to edit screen with gem data
    router.push({
      pathname: './editgem',
      params: { gemId: gem.id.toString() }
    });
  };

  const handleMarkAsSold = async (gem: ApprovedGem) => {
    Alert.alert(
      'Mark as Sold',
      `Are you sure you want to mark "${gem.name}" as sold?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Mark as Sold',
          style: 'destructive',
          onPress: async () => {
            try {
              await profileService.markAsSold(gem.id);
              Alert.alert('Success', 'Gem marked as SOLD successfully.');
              // Refresh the list
              await fetchMyGems();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to mark gem as sold.');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return 'checkmark-circle';
      case 'PENDING':
        return 'time-outline';
      case 'REJECTED':
        return 'close-circle';
      default:
        return 'information-circle';
    }
  };

  const renderGemCard = (gem: ApprovedGem) => {
    const imageUrl = gem.imageUrls && gem.imageUrls.length > 0 ? getAccessibleImageUrl(gem.imageUrls[0]) : null;
    const statusColor = getStatusColor(gem.status);
    const statusIcon = getStatusIcon(gem.status);
    const canEdit = gem.status === 'PENDING' || gem.status === 'REJECTED';
    const isApproved = gem.status === 'APPROVED';

    return (
      <View
        key={gem.id}
        className="mb-4 overflow-hidden bg-white rounded-lg shadow-md"
      >
        <TouchableOpacity onPress={() => handleGemPress(gem.id)}>
          {/* Gem Image */}
          <View className="relative h-48 bg-gray-200">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
            ) : (
              <View className="items-center justify-center flex-1">
                <Ionicons name="diamond-outline" size={60} color="#d1d5db" />
              </View>
            )}
            
            {/* Status Badge */}
            <View className="absolute top-2 right-2">
              <View className={`flex-row items-center px-3 py-1 rounded-full ${statusColor.split(' ')[0]}`}>
                <Ionicons name={statusIcon as any} size={14} color={statusColor.includes('green') ? '#15803d' : statusColor.includes('yellow') ? '#a16207' : '#b91c1c'} />
                <Text className={`ml-1 text-xs font-semibold ${statusColor.split(' ')[1]}`}>
                  {gem.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Gem Info */}
          <View className="p-4">
            <View className="flex-row items-start justify-between mb-2">
              <Text className="flex-1 text-lg font-bold text-gray-800" numberOfLines={1}>
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

            <Text className="mb-2 text-sm text-gray-600" numberOfLines={2}>
              {gem.description}
            </Text>

            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={16} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-600">{gem.origin}</Text>
              <Text className="mx-2 text-sm text-gray-400">•</Text>
              <Text className="text-sm text-gray-600">{gem.carat} ct</Text>
            </View>

            {gem.certificates && gem.certificates.length > 0 && (
              <View className="flex-row items-center mb-2">
                <Ionicons 
                  name={gem.certificates[0].verified ? "shield-checkmark" : "shield-outline"} 
                  size={16} 
                  color={gem.certificates[0].verified ? "#10b981" : "#6b7280"} 
                />
                <Text className={`ml-1 text-xs ${gem.certificates[0].verified ? 'text-emerald-600' : 'text-gray-600'}`}>
                  {gem.certificates[0].verified ? 'Verified Certificate' : 'Certificate Pending Verification'}
                </Text>
              </View>
            )}

            <View className="flex-row items-center justify-between pt-2 mt-2 border-t border-gray-100">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-emerald-600">
                  ${gem.price.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2 text-xs text-gray-500">
                  {new Date(gem.createdAt).toLocaleDateString()}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Action Buttons */}
        {canEdit && (
          <View className="px-4 pb-4">
            <TouchableOpacity
              onPress={() => handleEditGem(gem)}
              className="flex-row items-center justify-center py-3 border-2 rounded-lg border-emerald-500 bg-emerald-50"
            >
              <Ionicons name="create-outline" size={20} color="#059669" />
              <Text className="ml-2 font-semibold text-emerald-600">
                Edit & Resubmit
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mark as Sold Button for Approved gems */}
        {isApproved && (
          <View className="px-4 pb-4">
            <TouchableOpacity
              onPress={() => handleMarkAsSold(gem)}
              className="flex-row items-center justify-center py-3 border-2 border-orange-500 rounded-lg bg-orange-50"
            >
              <Ionicons name="checkmark-done-outline" size={20} color="#ea580c" />
              <Text className="ml-2 font-semibold text-orange-600">
                Mark as Sold
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-4 text-gray-600">Loading your ads...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 mt-3 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-white shadow-sm">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(main)/(profile)')}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="mt-3 text-2xl font-bold text-gray-800">My Ads</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(main)/(home)/sellgem')}
          className="px-4 py-2 mt-3 rounded-lg bg-emerald-500"
        >
          <View className="flex-row items-center ">
            <Ionicons name="add" size={20} color="white" />
            <Text className="ml-1 font-semibold text-white ">New Ad</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      {gems.length > 0 && (
        <View className="flex-row px-4 py-3 bg-white border-b border-gray-200">
          <View className="flex-1 pr-2">
            <Text className="text-xs text-gray-500">Total Ads</Text>
            <Text className="text-lg font-bold text-gray-800">{gems.length}</Text>
          </View>
          <View className="flex-1 px-2 border-l border-gray-200">
            <Text className="text-xs text-gray-500">Approved</Text>
            <Text className="text-lg font-bold text-green-600">
              {gems.filter(g => g.status === 'APPROVED').length}
            </Text>
          </View>
          <View className="flex-1 px-2 border-l border-gray-200">
            <Text className="text-xs text-gray-500">Pending</Text>
            <Text className="text-lg font-bold text-yellow-600">
              {gems.filter(g => g.status === 'PENDING').length}
            </Text>
          </View>
          <View className="flex-1 pl-2 border-l border-gray-200">
            <Text className="text-xs text-gray-500">Rejected</Text>
            <Text className="text-lg font-bold text-red-600">
              {gems.filter(g => g.status === 'REJECTED').length}
            </Text>
          </View>
        </View>
      )}

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
        {gems.length === 0 ? (
          <View className="items-center justify-center flex-1 py-20">
            <Ionicons name="diamond-outline" size={80} color="#d1d5db" />
            <Text className="mt-4 text-lg text-gray-500">No ads yet</Text>
            <Text className="mt-2 text-sm text-center text-gray-400">
              Start by listing your first gem
            </Text>
            <TouchableOpacity
              className="px-6 py-3 mt-6 rounded-lg bg-emerald-500"
              onPress={() => router.push('/(main)/(home)/sellgem')}
            >
              <View className="flex-row items-center">
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text className="ml-2 font-semibold text-white">Create New Ad</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {gems.map(renderGemCard)}
          </>
        )}
      </ScrollView>
    </View>
  );
}
