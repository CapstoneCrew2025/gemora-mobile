// app/(main)/(home)/index.tsx
import { router } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Alert, BackHandler, Image, Text, TouchableOpacity, View } from "react-native";
import { ChatbotButton } from "../../../components/chatbot";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../store/useAuthStore";
import { Feather } from '@expo/vector-icons';

<Feather name="bell" size={24} color="#000" />


export default function Home() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  const styles = useMemo(() => ({
    background: { backgroundColor: theme.colors.background },
    header: { backgroundColor: theme.colors.primary },
    cardContainer: { backgroundColor: theme.colors.card },
    text: { color: theme.colors.text },
    subtext: { color: theme.colors.subtext },
  }), [theme]);

  // Handle back button to close app instead of navigating back
  useEffect(() => {
    const backAction = () => {
      // Show confirmation before closing app
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel'
          },
          {
            text: 'Exit',
            onPress: () => BackHandler.exitApp()
          }
        ]
      );
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  // Show loading while performing operations
  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1" style={styles.background}>
        <Text className="text-lg" style={styles.subtext}>Loading...</Text>
      </View>
    );
  }

  // Note: Auth check is handled by the MainLayout, so we can assume user is authenticated here
  if (!user) {
    return (
      <View className="items-center justify-center flex-1" style={styles.background}>
        <Text className="text-lg" style={styles.subtext}>Loading user data...</Text>
      </View>
    );
  }


  return (
    <View className="flex-1" style={styles.header}>
      {/* Header Section with background diamond */}
      <View className="relative px-6 pt-16 pb-12">
        {/* Background diamond image with opacity - centered in emerald area */}
        <View className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center opacity-15">
          <Image
            source={require("../../../assets/images/diamond.png")}
            resizeMode="contain"
            className="w-40 h-40"
          />
        </View>

        <View className="z-10 flex-row items-center justify-between mb-10">
          <View>
            <Text className="mt-3 text-2xl font-bold" style={styles.text}>Welcome GeMora</Text>
            <Text className="text-m" style={styles.subtext}>Discover Precious Gems</Text>
          </View>
          <TouchableOpacity className="p-2">

            <Feather name="bell" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 px-6 pt-8 rounded-t-[40px]" style={styles.cardContainer}>

        {/* Buy Gem Card - Increased Size */}
        <TouchableOpacity className="flex-row items-center mb-5 overflow-hidden rounded-3xl h-28"
          style={{ backgroundColor: theme.colors.primary }}
          onPress={() => router.push('/(main)/(market)')}>
          {/* Icon Section with vertical divider */}
          <View className="items-center justify-center w-28 h-28">
            <View className="items-center justify-center w-20 h-20 border-4 border-white rounded-full" style={{ backgroundColor: theme.colors.primary }}>
              <Text className="text-4xl">💎</Text>
            </View>
          </View>

          {/* Vertical Divider */}
          <View className="w-px h-20 bg-white/30" />

          {/* Text Section */}
          <View className="flex-1 px-6">
            <Text className="mb-1 text-xl font-bold text-white">Buy Gem</Text>
            <Text className="text-sm text-white/90">Bid For Your Gem</Text>
          </View>
        </TouchableOpacity>

        {/* Sell Gem Card - Increased Size */}
        <TouchableOpacity
          className="flex-row items-center mb-6 overflow-hidden rounded-3xl h-28"
          style={{ backgroundColor: theme.colors.primary }}
          onPress={() => router.push('./sellgem')}
        >
          {/* Icon Section with vertical divider */}
          <View className="items-center justify-center w-28 h-28">
            <View className="items-center justify-center w-20 h-20 border-4 border-white rounded-full" style={{ backgroundColor: theme.colors.primary }}>
              <Text className="text-4xl">💰</Text>
            </View>
          </View>

          {/* Vertical Divider */}
          <View className="w-px h-20 bg-white/30" />

          {/* Text Section */}
          <View className="flex-1 px-6">
            <Text className="mb-1 text-xl font-bold text-white">Sell Gem</Text>
            <Text className="text-sm text-white/90">Sell Your Precious Gems</Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* Chatbot Button */}
      <ChatbotButton />
    </View>
  );
}
