import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authService } from '../../lib/authService';

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
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
      const response = await authService.forgotPassword(email);
      Alert.alert('Success', response.message);
      setStep('reset');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(email, otp, newPassword);
      Alert.alert(
        'Success',
        response.message,
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="items-center justify-center flex-1 px-6 bg-emerald-500">
      <ScrollView 
        className="w-full" 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md mx-auto">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="mb-2 text-4xl font-bold text-white">Forgot Password</Text>
            <Text className="text-center text-white/80">
              {step === 'email' 
                ? "Enter your email address and we'll send you an OTP to reset your password"
                : 'Enter the OTP sent to your email and create a new password'
              }
            </Text>
          </View>

          {/* Form Card */}
          <View className="p-6 bg-white shadow-lg rounded-3xl">
            {step === 'email' ? (
              <>
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
                  onPress={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-lg font-bold text-white">Send OTP</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Email Display */}
                <View className="p-3 mb-4 rounded-xl bg-emerald-50">
                  <Text className="text-sm font-semibold text-emerald-700">Sending OTP to:</Text>
                  <Text className="text-sm text-emerald-900">{email}</Text>
                </View>

                {/* OTP Input */}
                <View className="mb-4">
                  <Text className="mb-2 font-semibold text-gray-700">OTP</Text>
                  <TextInput
                    className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!loading}
                  />
                </View>

                {/* New Password Input */}
                <View className="mb-4">
                  <Text className="mb-2 font-semibold text-gray-700">New Password</Text>
                  <TextInput
                    className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>

                {/* Confirm Password Input */}
                <View className="mb-4">
                  <Text className="mb-2 font-semibold text-gray-700">Confirm Password</Text>
                  <TextInput
                    className="px-4 py-3 text-gray-800 bg-gray-100 rounded-xl"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>

                {/* Reset Button */}
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
                    <Text className="text-lg font-bold text-white">Reset Password</Text>
                  )}
                </TouchableOpacity>

                {/* Resend OTP Button */}
                <TouchableOpacity
                  onPress={() => setStep('email')}
                  disabled={loading}
                  className="items-center py-2 mb-2"
                >
                  <Text className="font-semibold text-emerald-600">
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </>
            )}

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
      </ScrollView>
    </View>
  );
}
