import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { getAccessibleImageUrl } from '../../../lib/apiClient';
import bidService, { BidResponse } from '../../../lib/bidService';
import { ApprovedGem, gemMarketService } from '../../../lib/gemMarketService';

const { width } = Dimensions.get('window');

export default function GemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [gem, setGem] = useState<ApprovedGem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedCertId, setExpandedCertId] = useState<number | null>(null);
  const [bidHistory, setBidHistory] = useState<BidResponse[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [placingBid, setPlacingBid] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGemDetails();
    }
  }, [id]);

  useEffect(() => {
    if (gem && gem.listingType === 'AUCTION') {
      fetchBidHistory();
    }
  }, [gem]);

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

  const fetchBidHistory = async () => {
    try {
      setLoadingBids(true);
      const bids = await bidService.getBidHistory(Number(id));
      setBidHistory(bids);
    } catch (error) {
      console.error('Error fetching bid history:', error);
      // Don't show error alert, just log it
    } finally {
      setLoadingBids(false);
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
    const highestBid = bidHistory.length > 0 ? bidHistory[0].amount : gem.price;
    setBidAmount((highestBid + 100).toString());
    setShowBidModal(true);
  };

  const submitBid = async () => {
    if (!gem) return;
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid bid amount');
      return;
    }

    const highestBid = bidHistory.length > 0 ? bidHistory[0].amount : gem.price;
    if (amount <= highestBid) {
      Alert.alert(
        'Bid Too Low',
        `Your bid must be higher than the current ${bidHistory.length > 0 ? 'highest bid' : 'starting price'} of $${highestBid.toLocaleString()}`
      );
      return;
    }

    try {
      setPlacingBid(true);
      await bidService.placeBid({
        gemId: gem.id,
        amount: amount,
      });
      
      Alert.alert('Success', 'Your bid has been placed successfully!');
      setShowBidModal(false);
      setBidAmount('');
      
      // Refresh bid history
      await fetchBidHistory();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to place bid');
    } finally {
      setPlacingBid(false);
    }
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

  const handleViewCertificate = (certId: number) => {
    // Toggle expanded state
    setExpandedCertId(expandedCertId === certId ? null : certId);
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(main)/(market)');
    }
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-4 text-gray-600">Loading gem details...</Text>
      </View>
    );
  }

  if (!gem) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <Ionicons name="diamond-outline" size={80} color="#d1d5db" />
        <Text className="mt-4 text-lg text-gray-500">Gem not found</Text>
        <TouchableOpacity
          className="px-6 py-3 mt-4 rounded-lg bg-emerald-500"
          onPress={handleGoBack}
        >
          <Text className="font-semibold text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pt-12 pb-4 bg-gradient-to-b from-black/30 to-transparent">
        <TouchableOpacity
          className="p-2 bg-white rounded-full shadow-lg"
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2 bg-white rounded-full shadow-lg" activeOpacity={0.7}>
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
                <View className="absolute left-0 right-0 flex-row justify-center bottom-4">
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
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-4">
              <Text className="mb-1 text-2xl font-bold text-gray-800">
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
          <View className="self-start px-3 py-1 mb-4 bg-gray-100 rounded-full">
            <Text className="text-sm font-medium text-gray-700">{gem.category}</Text>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="mb-2 text-lg font-semibold text-gray-800">Description</Text>
            <Text className="leading-6 text-gray-600">{gem.description}</Text>
          </View>

          {/* Specifications */}
          <View className="mb-4">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Specifications</Text>
            <View className="p-4 rounded-lg bg-gray-50">
              <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-600">Carat Weight</Text>
                <Text className="font-semibold text-gray-800">{gem.carat} ct</Text>
              </View>
              <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-600">Origin</Text>
                <Text className="font-semibold text-gray-800">{gem.origin}</Text>
              </View>
              <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-600">Category</Text>
                <Text className="font-semibold text-gray-800">{gem.category}</Text>
              </View>
              {gem.certificationNumber && (
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-gray-600">Certification</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                    <Text className="ml-1 font-semibold text-emerald-600">
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
              <Text className="mb-3 text-lg font-semibold text-gray-800">Certificates</Text>
              {gem.certificates.map((cert) => {
                const isExpanded = expandedCertId === cert.id;
                const certificateUrl = cert.fileUrl ? getAccessibleImageUrl(cert.fileUrl) : null;
                const isImage = certificateUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                
                return (
                  <View key={cert.id} className="p-4 mb-3 rounded-lg bg-emerald-50">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className="mb-1 font-semibold text-gray-800">
                          {cert.certificateNumber}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {cert.issuingAuthority}
                        </Text>
                      </View>
                      {cert.verified && (
                        <View className="px-2 py-1 rounded-full bg-emerald-500">
                          <Text className="text-xs font-semibold text-white">Verified</Text>
                        </View>
                      )}
                    </View>
                    <Text className="mb-2 text-xs text-gray-500">
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </Text>
                    
                    {/* Certificate File Preview */}
                    {certificateUrl && (
                      <>
                        <TouchableOpacity 
                          className="flex-row items-center justify-between p-3 mt-2 bg-white rounded-lg"
                          onPress={() => handleViewCertificate(cert.id)}
                        >
                          <View className="flex-row items-center flex-1">
                            <Ionicons 
                              name={isImage ? "image-outline" : "document-outline"} 
                              size={20} 
                              color="#10b981" 
                            />
                            <Text className="flex-1 ml-2 font-semibold text-emerald-600">
                              {isExpanded ? 'Hide Certificate' : 'View Certificate'}
                            </Text>
                          </View>
                          <Ionicons 
                            name={isExpanded ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color="#10b981" 
                          />
                        </TouchableOpacity>

                        {/* Expanded Certificate View */}
                        {isExpanded && (
                          <View className="mt-3 overflow-hidden bg-white rounded-lg">
                            {isImage ? (
                              <Image
                                source={{ uri: certificateUrl }}
                                style={{ width: '100%', height: 400 }}
                                resizeMode="contain"
                                onError={(e) => {
                                  console.log('Certificate image load error:', e.nativeEvent.error);
                                  Alert.alert('Error', 'Failed to load certificate image');
                                }}
                              />
                            ) : (
                              <View className="items-center justify-center p-8 bg-gray-100">
                                <Ionicons name="document-text-outline" size={80} color="#10b981" />
                                <Text className="mt-4 text-sm text-center text-gray-600">
                                  PDF Certificate
                                </Text>
                                <Text className="mt-2 text-xs text-center text-gray-500">
                                  {cert.certificateNumber}
                                </Text>
                                <TouchableOpacity
                                  className="px-4 py-2 mt-4 rounded-lg bg-emerald-500"
                                  onPress={async () => {
                                    try {
                                      const supported = await Linking.canOpenURL(certificateUrl);
                                      if (supported) {
                                        await Linking.openURL(certificateUrl);
                                      } else {
                                        Alert.alert('Error', 'Cannot open PDF file');
                                      }
                                    } catch (error) {
                                      Alert.alert('Error', 'Failed to open PDF');
                                    }
                                  }}
                                >
                                  <Text className="font-semibold text-white">
                                    Open PDF in Browser
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        )}
                      </>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Bid History for Auction Items */}
          {gem.listingType === 'AUCTION' && (
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-gray-800">Bid History</Text>
                {loadingBids && <ActivityIndicator size="small" color="#10b981" />}
              </View>
              
              {bidHistory.length > 0 ? (
                <View className="overflow-hidden rounded-lg bg-gray-50">
                  {bidHistory.map((bid, index) => (
                    <View
                      key={bid.bidId}
                      className={`p-4 border-b border-gray-200 ${
                        index === 0 ? 'bg-emerald-50' : ''
                      }`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <View className="flex-row items-center">
                            <Text className={`text-lg font-bold ${
                              index === 0 ? 'text-emerald-600' : 'text-gray-800'
                            }`}>
                              ${bid.amount.toLocaleString()}
                            </Text>
                            {index === 0 && (
                              <View className="px-2 py-1 ml-2 rounded-full bg-emerald-500">
                                <Text className="text-xs font-semibold text-white">Highest Bid</Text>
                              </View>
                            )}
                          </View>
                          <Text className="mt-1 text-xs text-gray-500">
                            Bidder ID: {bid.bidderId.toString().padStart(4, '0')}
                          </Text>
                        </View>
                        <Text className="text-xs text-gray-500">
                          {new Date(bid.placedAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center justify-center p-8 rounded-lg bg-gray-50">
                  <Ionicons name="pricetag-outline" size={48} color="#d1d5db" />
                  <Text className="mt-2 text-sm text-gray-500">No bids yet. Be the first to bid!</Text>
                </View>
              )}
            </View>
          )}

          {/* Listing Info */}
          <View className="p-4 mb-4 rounded-lg bg-gray-50">
            <Text className="mb-1 text-sm text-gray-500">Listed on</Text>
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
      <View className="p-4 bg-white border-t border-gray-200">
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="flex-1 py-3 mr-2 bg-gray-100 rounded-lg"
            onPress={handleContactSeller}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="chatbubble-outline" size={20} color="#1f2937" />
              <Text className="ml-2 font-semibold text-gray-800">Contact Seller</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 rounded-lg bg-emerald-500"
            onPress={gem.listingType === 'AUCTION' ? handlePlaceBid : handleBuyNow}
          >
            <Text className="font-bold text-center text-white">
              {gem.listingType === 'AUCTION' ? 'Place Bid' : 'Buy Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bid Modal */}
      <Modal
        visible={showBidModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBidModal(false)}
      >
        <View className="justify-end flex-1 bg-black/50">
          <View className="bg-white rounded-t-3xl">
            <View className="p-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-gray-800">Place Your Bid</Text>
                <TouchableOpacity onPress={() => setShowBidModal(false)}>
                  <Ionicons name="close-circle" size={28} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View className="p-4 mb-4 rounded-lg bg-emerald-50">
                <Text className="mb-1 text-sm text-gray-600">Current {bidHistory.length > 0 ? 'Highest Bid' : 'Starting Price'}</Text>
                <Text className="text-2xl font-bold text-emerald-600">
                  ${(bidHistory.length > 0 ? bidHistory[0].amount : gem?.price || 0).toLocaleString()}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Your Bid Amount</Text>
                <View className="flex-row items-center px-4 py-3 border-2 rounded-lg border-emerald-500">
                  <Text className="mr-2 text-xl font-bold text-gray-800">$</Text>
                  <TextInput
                    value={bidAmount}
                    onChangeText={setBidAmount}
                    placeholder="Enter amount"
                    keyboardType="decimal-pad"
                    className="flex-1 text-xl font-semibold text-gray-800"
                  />
                </View>
                <Text className="mt-2 text-xs text-gray-500">
                  Minimum bid: ${((bidHistory.length > 0 ? bidHistory[0].amount : gem?.price || 0) + 1).toLocaleString()}
                </Text>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="flex-1 py-3 bg-gray-100 rounded-lg"
                  onPress={() => setShowBidModal(false)}
                  disabled={placingBid}
                >
                  <Text className="font-semibold text-center text-gray-800">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-emerald-500"
                  onPress={submitBid}
                  disabled={placingBid}
                >
                  {placingBid ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="font-bold text-center text-white">Confirm Bid</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
