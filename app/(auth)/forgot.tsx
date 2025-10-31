import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement forgot password API call
      // await authService.forgotPassword(email);
      
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="items-center justify-center flex-1 px-6 bg-emerald-500">
      <View className="w-full max-w-md">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="mb-2 text-4xl font-bold text-white">Forgot Password</Text>
          <Text className="text-center text-white/80">
            Enter your email address and we'll send you instructions to reset your password
          </Text>
        </View>

        {/* Form Card */}
        <View className="p-6 bg-white shadow-lg rounded-3xl">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-700">Email</Text>
            <TextInput
              className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 items-center mb-4 ${
              loading ? 'bg-emerald-300' : 'bg-emerald-500'
            }`}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-bold text-white">Send Reset Link</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            disabled={loading}
            className="items-center py-2"
          >
            <Text className="font-semibold text-emerald-600">
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
