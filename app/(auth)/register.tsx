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
    console.log('Register screen: Auth state changed:', { isAuthenticated, isLoading });
    if (isAuthenticated && !isLoading) {
      console.log('Register screen: Redirecting to home...');
      router.replace('/');
    }
  }, [isAuthenticated, isLoading]);

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
      console.log('Starting registration process...');
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      console.log('Registration successful, authentication state should be updated');
      
      // Clear form fields and errors after successful registration
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setNameError('');
      setEmailError('');
      setPasswordError('');
      setConfirmPasswordError('');
      clearError();
      
      // Manual navigation as backup
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/');
        }
      }, 100);
      
    } catch (error: any) {
      console.error('Registration failed:', error);
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
        <View className="justify-center flex-1 px-6 py-12">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="items-center justify-center w-20 h-20 mb-6 bg-green-600 rounded-full">
              <Text className="text-2xl font-bold text-white">G</Text>
            </View>
            <Text className="mb-2 text-3xl font-bold text-gray-900">Create Account</Text>
            <Text className="text-center text-gray-600">
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
              <View className="p-4 border border-red-200 rounded-lg bg-red-50">
                <Text className="text-sm text-center text-red-700">
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
            <Text className="mt-4 text-xs leading-5 text-center text-gray-500">
              By creating an account, you agree to our{' '}
              <Text className="font-medium text-green-600">Terms of Service</Text>
              {' '}and{' '}
              <Text className="font-medium text-green-600">Privacy Policy</Text>
            </Text>
          </View>

          {/* Login Link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="font-semibold text-green-600">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
