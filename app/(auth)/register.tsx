import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth, useAuthActions } from '../../store/useAuthStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { isLoading, error, isAuthenticated } = useAuth();
  const { register, clearError } = useAuthActions();

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  // Clear API error when inputs change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [name, email, password, confirmPassword, clearError]);

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Name validation
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 5) {
      setPasswordError('Password must be at least 5 characters');
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      // Success - user will be redirected by useEffect
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      // Error is handled by the store and displayed via error state
      Alert.alert('Registration Failed', error.message || 'Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-green-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-green-600 rounded-full items-center justify-center mb-6">
              <Text className="text-white text-2xl font-bold">G</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-gray-600 text-center">
              Join GeMora and start your journey
            </Text>
          </View>

          {/* Register Form */}
          <View className="space-y-6">
            {/* Name Input */}
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              autoCapitalize="words"
              autoComplete="name"
              error={nameError}
            />

            {/* Email Input */}
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={emailError}
            />

            {/* Password Input */}
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              autoComplete="new-password"
              error={passwordError}
            />

            {/* Confirm Password Input */}
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              autoComplete="new-password"
              error={confirmPasswordError}
            />

            {/* Error Message */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Text className="text-red-700 text-sm text-center">
                  {error}
                </Text>
              </View>
            )}

            {/* Register Button */}
            <Button
              title="Create Account"
              onPress={handleRegister}
              isLoading={isLoading}
              className="w-full mt-6"
            />

            {/* Terms and Privacy */}
            <Text className="text-xs text-gray-500 text-center mt-4 leading-5">
              By creating an account, you agree to our{' '}
              <Text className="text-green-600 font-medium">Terms of Service</Text>
              {' '}and{' '}
              <Text className="text-green-600 font-medium">Privacy Policy</Text>
            </Text>
          </View>

          {/* Login Link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-green-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
