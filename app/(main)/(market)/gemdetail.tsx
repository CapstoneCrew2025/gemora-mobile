import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Keyboard,
    Linking,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { getAccessibleImageUrl } from '../../../lib/apiClient';
import bidService, { AuctionTimeResponse, BidResponse } from '../../../lib/bidService';
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
  const [auctionTime, setAuctionTime] = useState<AuctionTimeResponse | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const { theme } = useTheme();

  const styles = useMemo(() => ({
    background: { backgroundColor: theme.colors.background },
    card: { backgroundColor: theme.colors.card },
    text: { color: theme.colors.text },
    subtext: { color: theme.colors.subtext },
    border: { borderColor: theme.colors.border },
    primaryBg: { backgroundColor: theme.colors.primary },
    primaryText: { color: theme.colors.primary },
    mutedBg: { backgroundColor: `${theme.colors.primary}22` },
  }), [theme]);

  useEffect(() => {
    if (id) {
      fetchGemDetails();
    }
  }, [id]);

  useEffect(() => {
    if (gem && gem.listingType === 'AUCTION') {
      fetchBidHistory();
      fetchAuctionTime();
    }
  }, [gem]);

  useEffect(() => {
    if (!auctionTime || isExpired) return;

    // Initialize countdown from API data
    let totalSeconds = 
      (auctionTime.remainingDays * 24 * 60 * 60) +
      (auctionTime.remainingHours * 60 * 60) +
      (auctionTime.remainingMinutes * 60);

    const interval = setInterval(() => {
      if (totalSeconds <= 0) {
        setIsExpired(true);
        clearInterval(interval);
        return;
      }

      totalSeconds--;
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionTime, isExpired]);

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

  const fetchAuctionTime = async () => {
    try {
      const time = await bidService.getRemainingTime(Number(id));
      setAuctionTime(time);
      setIsExpired(time.expired);
    } catch (error) {
      console.error('Error fetching auction time:', error);
    }
  };

  const handleContactSeller = () => {
    if (!gem) return;
    const chatPath = `/(main)/(market)/ChatScreen?sellerId=${gem.sellerId}&sellerName=${encodeURIComponent('Seller #' + gem.sellerId)}&gemName=${encodeURIComponent(gem.name)}&gemId=${gem.id}` as any;
    router.push(chatPath);
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
      <View className="items-center justify-center flex-1" style={styles.background}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text className="mt-4" style={styles.subtext}>Loading gem details...</Text>
      </View>
    );
  }

  if (!gem) {
    return (
      <View className="items-center justify-center flex-1" style={styles.background}>
        <Ionicons name="diamond-outline" size={80} color={theme.colors.subtext} />
        <Text className="mt-4 text-lg" style={styles.subtext}>Gem not found</Text>
        <TouchableOpacity
          className="px-6 py-3 mt-4 rounded-lg"
          style={styles.primaryBg}
          onPress={handleGoBack}
        >
          <Text className="font-semibold text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1" style={styles.background}>
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pt-12 pb-4">
        <TouchableOpacity
          className="p-2 rounded-full shadow-lg"
          style={styles.card}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity className="p-2 rounded-full shadow-lg" style={styles.card} activeOpacity={0.7}>
          <Ionicons name="heart-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" style={styles.background}>
        {/* Image Gallery */}
        <View style={[styles.card, styles.border, { borderBottomWidth: 1 }]}>
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
            <View className="items-center justify-center" style={[{ width, height: 400 }, styles.card]}>
              <Ionicons name="diamond-outline" size={100} color={theme.colors.subtext} />
            </View>
          )}
        </View>

        {/* Gem Details */}
        <View className="p-4" style={styles.background}>
          {/* Title and Price */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-4">
              <Text className="mb-1 text-2xl font-bold" style={styles.text}>
                {gem.name}
              </Text>
              <View
                className="self-start px-3 py-1 rounded-full"
                style={gem.listingType === 'AUCTION' ? styles.mutedBg : styles.mutedBg}
              >
                <Text className="text-sm font-semibold" style={styles.primaryText}>
                  {gem.listingType === 'AUCTION' ? 'Auction' : 'For Sale'}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-sm" style={styles.subtext}>
                {gem.listingType === 'AUCTION' ? 'Current Bid' : 'Price'}
              </Text>
              <Text className="text-3xl font-bold" style={styles.primaryText}>
                ${gem.price.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Category Badge */}
          <View className="self-start px-3 py-1 mb-4 rounded-full" style={[styles.card, styles.border, { borderWidth: 1 }]}> 
            <Text className="text-sm font-medium" style={styles.text}>{gem.category}</Text>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="mb-2 text-lg font-semibold" style={styles.text}>Description</Text>
            <Text className="leading-6" style={styles.subtext}>{gem.description}</Text>
          </View>

          {/* Specifications */}
          <View className="mb-4">
            <Text className="mb-3 text-lg font-semibold" style={styles.text}>Specifications</Text>
            <View className="p-4 rounded-lg" style={[styles.card, styles.border, { borderWidth: 1 }]}>
              <View className="flex-row items-center justify-between py-2 border-b" style={styles.border}>
                <Text style={styles.subtext}>Carat Weight</Text>
                <Text className="font-semibold" style={styles.text}>{gem.carat} ct</Text>
              </View>
              <View className="flex-row items-center justify-between py-2 border-b" style={styles.border}>
                <Text style={styles.subtext}>Origin</Text>
                <Text className="font-semibold" style={styles.text}>{gem.origin}</Text>
              </View>
              <View className="flex-row items-center justify-between py-2 border-b" style={styles.border}>
                <Text style={styles.subtext}>Category</Text>
                <Text className="font-semibold" style={styles.text}>{gem.category}</Text>
              </View>
              {gem.certificationNumber && (
                <View className="flex-row items-center justify-between py-2">
                  <Text style={styles.subtext}>Certification</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} />
                    <Text className="ml-1 font-semibold" style={styles.primaryText}>
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
              <Text className="mb-3 text-lg font-semibold" style={styles.text}>Certificates</Text>
              {gem.certificates.map((cert) => {
                const isExpanded = expandedCertId === cert.id;
                const certificateUrl = cert.fileUrl ? getAccessibleImageUrl(cert.fileUrl) : null;
                const isImage = certificateUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                
                return (
                  <View key={cert.id} className="p-4 mb-3 rounded-lg" style={[styles.card, styles.border, { borderWidth: 1 }]}> 
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className="mb-1 font-semibold" style={styles.text}>
                          {cert.certificateNumber}
                        </Text>
                        <Text className="text-sm" style={styles.subtext}>
                          {cert.issuingAuthority}
                        </Text>
                      </View>
                      {cert.verified && (
                        <View className="px-2 py-1 rounded-full" style={styles.primaryBg}>
                          <Text className="text-xs font-semibold text-white">Verified</Text>
                        </View>
                      )}
                    </View>
                    <Text className="mb-2 text-xs" style={styles.subtext}>
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </Text>
                    
                    {/* Certificate File Preview */}
                    {certificateUrl && (
                      <>
                        <TouchableOpacity 
                          className="flex-row items-center justify-between p-3 mt-2 rounded-lg"
                          style={styles.card}
                          onPress={() => handleViewCertificate(cert.id)}
                        >
                          <View className="flex-row items-center flex-1">
                            <Ionicons 
                              name={isImage ? "image-outline" : "document-outline"} 
                              size={20} 
                              color={theme.colors.primary} 
                            />
                            <Text className="flex-1 ml-2 font-semibold" style={styles.primaryText}>
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
                          <View className="mt-3 overflow-hidden rounded-lg" style={styles.card}>
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
                              <View className="items-center justify-center p-8" style={styles.background}>
                                <Ionicons name="document-text-outline" size={80} color={theme.colors.primary} />
                                <Text className="mt-4 text-sm text-center" style={styles.subtext}>
                                  PDF Certificate
                                </Text>
                                <Text className="mt-2 text-xs text-center" style={styles.subtext}>
                                  {cert.certificateNumber}
                                </Text>
                                <TouchableOpacity
                                  className="px-4 py-2 mt-4 rounded-lg"
                                  style={styles.primaryBg}
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

          {/* Auction Countdown Timer */}
          {gem.listingType === 'AUCTION' && auctionTime && (
            <View className="mb-4">
              <Text className="mb-3 text-lg font-semibold" style={styles.text}>Auction Ends In</Text>
              {isExpired ? (
                <View className="p-6 rounded-lg" style={[styles.card, styles.border, { borderWidth: 1 }]}> 
                  <View className="items-center">
                    <Ionicons name="time-outline" size={48} color={theme.colors.primary} />
                    <Text className="mt-2 text-xl font-bold" style={styles.primaryText}>Auction Expired</Text>
                    <Text className="mt-1 text-sm" style={styles.subtext}>This auction has ended</Text>
                  </View>
                </View>
              ) : (
                <View className="p-4 rounded-lg" style={[styles.card, styles.border, { borderWidth: 1 }]}> 
                  <View className="flex-row items-center justify-around">
                    <View className="items-center">
                      <View className="px-4 py-3 rounded-lg shadow-sm" style={styles.card}>
                        <Text className="text-3xl font-bold" style={styles.text}>{countdown.days}</Text>
                      </View>
                      <Text className="mt-2 text-xs font-medium" style={styles.subtext}>Days</Text>
                    </View>
                    <Text className="text-2xl font-bold" style={styles.subtext}>:</Text>
                    <View className="items-center">
                      <View className="px-4 py-3 rounded-lg shadow-sm" style={styles.card}>
                        <Text className="text-3xl font-bold" style={styles.text}>{countdown.hours.toString().padStart(2, '0')}</Text>
                      </View>
                      <Text className="mt-2 text-xs font-medium" style={styles.subtext}>Hours</Text>
                    </View>
                    <Text className="text-2xl font-bold" style={styles.subtext}>:</Text>
                    <View className="items-center">
                      <View className="px-4 py-3 rounded-lg shadow-sm" style={styles.card}>
                        <Text className="text-3xl font-bold" style={styles.text}>{countdown.minutes.toString().padStart(2, '0')}</Text>
                      </View>
                      <Text className="mt-2 text-xs font-medium" style={styles.subtext}>Minutes</Text>
                    </View>
                    <Text className="text-2xl font-bold" style={styles.subtext}>:</Text>
                    <View className="items-center">
                      <View className="px-4 py-3 rounded-lg shadow-sm" style={styles.card}>
                        <Text className="text-3xl font-bold" style={styles.primaryText}>{countdown.seconds.toString().padStart(2, '0')}</Text>
                      </View>
                      <Text className="mt-2 text-xs font-medium" style={styles.subtext}>Seconds</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Bid History for Auction Items */}
          {gem.listingType === 'AUCTION' && (
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold" style={styles.text}>Bid History</Text>
                {loadingBids && <ActivityIndicator size="small" color={theme.colors.primary} />}
              </View>
              
              {bidHistory.length > 0 ? (
                <View className="overflow-hidden rounded-lg" style={[styles.card, styles.border, { borderWidth: 1 }]}>
                  {bidHistory.map((bid, index) => (
                    <View
                      key={bid.bidId}
                      className="p-4 border-b"
                      style={[styles.border, index === 0 ? styles.mutedBg : null]}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <View className="flex-row items-center">
                            <Text className="text-lg font-bold" style={index === 0 ? styles.primaryText : styles.text}>
                              ${bid.amount.toLocaleString()}
                            </Text>
                            {index === 0 && (
                              <View className="px-2 py-1 ml-2 rounded-full" style={styles.primaryBg}>
                                <Text className="text-xs font-semibold text-white">Highest Bid</Text>
                              </View>
                            )}
                          </View>
                          <Text className="mt-1 text-xs" style={styles.subtext}>
                            Bidder ID: {bid.bidderId.toString().padStart(4, '0')}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-xs font-medium" style={styles.subtext}>
                            {bid.daysAgo === 0 ? 'Today' : `${bid.daysAgo} day${bid.daysAgo > 1 ? 's' : ''} ago`}
                          </Text>
                          <Text className="mt-1 text-xs" style={styles.subtext}>
                            {new Date(bid.placedAt).toLocaleString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center justify-center p-8 rounded-lg" style={[styles.card, styles.border, { borderWidth: 1 }]}>
                  <Ionicons name="pricetag-outline" size={48} color={theme.colors.subtext} />
                  <Text className="mt-2 text-sm" style={styles.subtext}>No bids yet. Be the first to bid!</Text>
                </View>
              )}
            </View>
          )}

          {/* Listing Info */}
          <View className="p-4 mb-4 rounded-lg" style={[styles.card, styles.border, { borderWidth: 1 }]}>
            <Text className="mb-1 text-sm" style={styles.subtext}>Listed on</Text>
            <Text style={styles.text}>
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
      <View className="p-4 border-t" style={[styles.card, styles.border]}>
        {gem.listingType === 'AUCTION' ? (
          <View className="flex-row space-x-2">
            <TouchableOpacity
              className="flex-1 py-3 mr-2 rounded-lg"
              style={[styles.card, styles.border, { borderWidth: 1 }]}
              onPress={handleContactSeller}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="chatbubble-outline" size={20} color={theme.colors.text} />
                <Text className="ml-2 font-semibold" style={styles.text}>Contact Seller</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg"
              style={styles.primaryBg}
              onPress={handlePlaceBid}
            >
              <Text className="font-bold text-center text-white">Place Bid</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="py-3 rounded-lg"
            style={styles.primaryBg}
            onPress={handleContactSeller}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="chatbubble-outline" size={20} color="#fff" />
              <Text className="ml-2 text-lg font-semibold text-white">Contact Seller</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Bid Modal */}
      <Modal
        visible={showBidModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBidModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="justify-end flex-1 bg-black/50">
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="rounded-t-3xl" style={styles.card}>
                <View className="p-6">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-xl font-bold" style={styles.text}>Place Your Bid</Text>
                    <TouchableOpacity onPress={() => setShowBidModal(false)}>
                      <Ionicons name="close-circle" size={28} color={theme.colors.subtext} />
                    </TouchableOpacity>
                  </View>

                  <View className="p-4 mb-4 rounded-lg" style={[styles.mutedBg, styles.border, { borderWidth: 1 }]}>
                    <Text className="mb-1 text-sm" style={styles.subtext}>Current {bidHistory.length > 0 ? 'Highest Bid' : 'Starting Price'}</Text>
                    <Text className="text-2xl font-bold" style={styles.primaryText}>
                      ${(bidHistory.length > 0 ? bidHistory[0].amount : gem?.price || 0).toLocaleString()}
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-medium" style={styles.text}>Your Bid Amount</Text>
                    <View className="flex-row items-center px-4 py-3 border-2 rounded-lg" style={[styles.border, styles.card]}> 
                      <Text className="mr-2 text-xl font-bold" style={styles.text}>$</Text>
                      <TextInput
                        value={bidAmount}
                        onChangeText={setBidAmount}
                        placeholder="Enter amount"
                        keyboardType="decimal-pad"
                        className="flex-1 text-xl font-semibold"
                        style={styles.text}
                      />
                    </View>
                    <Text className="mt-2 text-xs" style={styles.subtext}>
                      Minimum bid: ${((bidHistory.length > 0 ? bidHistory[0].amount : gem?.price || 0) + 1).toLocaleString()}
                    </Text>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 py-3 rounded-lg"
                      style={[styles.card, styles.border, { borderWidth: 1 }]}
                      onPress={() => setShowBidModal(false)}
                      disabled={placingBid}
                    >
                      <Text className="font-semibold text-center" style={styles.text}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 py-3 rounded-lg"
                      style={styles.primaryBg}
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
