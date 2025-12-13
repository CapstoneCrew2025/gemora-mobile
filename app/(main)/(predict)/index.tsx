import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import predictService, { PredictResponse } from '../../../lib/predictService';

export default function Predict() {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);

  const styles = useMemo(() => ({
    background: { backgroundColor: theme.colors.background },
    card: { backgroundColor: theme.colors.card },
    text: { color: theme.colors.text },
    subtext: { color: theme.colors.subtext },
    border: { borderColor: theme.colors.border },
    primaryBg: { backgroundColor: theme.colors.primary },
    primaryText: { color: theme.colors.primary },
  }), [theme]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to select images.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setResult(null); // Clear previous results
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take photos.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setResult(null); // Clear previous results
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    try {
      setPredicting(true);
      const prediction = await predictService.predictGem(selectedImage);
      setResult(prediction);

      if (!prediction.success) {
        Alert.alert('Prediction Failed', prediction.error || 'Unable to predict gem type.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to predict gem type.');
    } finally {
      setPredicting(false);
    }
  };

  const resetPrediction = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <View className="flex-1 " style={styles.background}>
      {/* Header */}
      <View className="px-4 pt-12 pb-4" style={styles.card}>
        <Text className="mt-4 mb-1 text-2xl font-bold " style={styles.text}>
          Gem Predictor
        </Text>
        <Text className="text-sm" style={styles.subtext}>
          Upload or capture a gem image to identify its type
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Image Selection Area */}
        {!selectedImage ? (
          <View className="mb-6">
            <View
              className="items-center justify-center p-8 mb-4 border-2 border-dashed rounded-lg"
              style={[styles.card, styles.border, { borderWidth: 2, minHeight: 300 }]}
            >
              <Ionicons name="image-outline" size={80} color={theme.colors.subtext} />
              <Text className="mt-4 text-lg font-semibold" style={styles.text}>
                No Image Selected
              </Text>
              <Text className="mt-2 text-center" style={styles.subtext}>
                Choose an image from your gallery or take a new photo
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                className="flex-row items-center justify-center px-6 py-4 rounded-lg"
                style={styles.primaryBg}
                onPress={pickImage}
              >
                <Ionicons name="images-outline" size={24} color="#fff" />
                <Text className="ml-3 text-lg font-semibold text-white">
                  Choose from Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center px-6 py-4 rounded-lg"
                style={[styles.card, styles.border, { borderWidth: 1 }]}
                onPress={takePhoto}
              >
                <Ionicons name="camera-outline" size={24} color={theme.colors.text} />
                <Text className="ml-3 text-lg font-semibold" style={styles.text}>
                  Take Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="mb-6">
            {/* Selected Image Preview */}
            <View className="mb-4 overflow-hidden rounded-lg" style={[styles.card, { elevation: 4 }]}>
              <Image
                source={{ uri: selectedImage }}
                className="w-full"
                style={{ height: 300 }}
                resizeMode="cover"
              />
            </View>

            {/* Prediction Result */}
            {result && (
              <View
                className="p-4 mb-4 rounded-lg"
                style={[
                  result.success ? styles.card : { backgroundColor: '#fee' },
                  styles.border,
                  { borderWidth: 1 },
                ]}
              >
                {result.success ? (
                  <>
                    <View className="flex-row items-center mb-3">
                      <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
                      <Text className="ml-2 text-xl font-bold" style={styles.primaryText}>
                        Prediction Result
                      </Text>
                    </View>
                    <View className="mb-2">
                      <Text className="text-sm" style={styles.subtext}>
                        Gem Type
                      </Text>
                      <Text className="text-2xl font-bold" style={styles.text}>
                        {result.gem_type}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-sm" style={styles.subtext}>
                        Confidence
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-xl font-bold" style={styles.primaryText}>
                          {(result.confidence * 100).toFixed(2)}%
                        </Text>
                        {result.confidence > 0.8 && (
                          <View className="px-2 py-1 ml-2 rounded-full" style={styles.primaryBg}>
                            <Text className="text-xs font-semibold text-white">High Confidence</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="close-circle" size={28} color="#dc2626" />
                      <Text className="ml-2 text-xl font-bold text-red-600">
                        Prediction Failed
                      </Text>
                    </View>
                    <Text className="text-sm text-red-500">
                      {result.error || 'Unable to predict gem type'}
                    </Text>
                  </>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View className="gap-3">
              {!result && (
                <TouchableOpacity
                  className="flex-row items-center justify-center px-6 py-4 rounded-lg"
                  style={styles.primaryBg}
                  onPress={handlePredict}
                  disabled={predicting}
                >
                  {predicting ? (
                    <>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text className="ml-3 text-lg font-semibold text-white">
                        Analyzing...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="analytics-outline" size={24} color="#fff" />
                      <Text className="ml-3 text-lg font-semibold text-white">
                        Predict Gem Type
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="flex-row items-center justify-center px-6 py-4 rounded-lg"
                style={[styles.card, styles.border, { borderWidth: 1 }]}
                onPress={resetPrediction}
                disabled={predicting}
              >
                <Ionicons name="refresh-outline" size={24} color={theme.colors.text} />
                <Text className="ml-3 text-lg font-semibold" style={styles.text}>
                  {result ? 'Try Another Image' : 'Change Image'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Info Section */}
        <View className="p-4 mb-6 rounded-lg" style={[styles.card, styles.border, { borderWidth: 1 }]}>
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
            <Text className="ml-2 text-lg font-semibold" style={styles.text}>
              How it Works
            </Text>
          </View>
          <View className="gap-2">
            <View className="flex-row">
              <Text className="mr-2" style={styles.primaryText}>•</Text>
              <Text className="flex-1" style={styles.subtext}>
                Upload a clear image of your gemstone
              </Text>
            </View>
            <View className="flex-row">
              <Text className="mr-2" style={styles.primaryText}>•</Text>
              <Text className="flex-1" style={styles.subtext}>
                Our AI analyzes the gem's features
              </Text>
            </View>
            <View className="flex-row">
              <Text className="mr-2" style={styles.primaryText}>•</Text>
              <Text className="flex-1" style={styles.subtext}>
                Get instant prediction with confidence score
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
