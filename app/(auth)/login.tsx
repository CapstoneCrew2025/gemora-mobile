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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { isLoading, error, isAuthenticated } = useAuth();
  const { login, clearError } = useAuthActions();

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('Login screen: Auth state changed:', { isAuthenticated, isLoading });
    if (isAuthenticated && !isLoading) {
      console.log('Login screen: Redirecting to home...');
      router.replace('/');
    }
  }, [isAuthenticated, isLoading]);

  // Clear API error when inputs change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, clearError]);

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

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

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      console.log('Starting login process...');
      await login({
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      console.log('Login successful, authentication state should be updated');
      
      // Clear form fields after successful login
      setEmail('');
      setPassword('');
      setEmailError('');
      setPasswordError('');
      
      // Clear any remaining errors
      clearError();
      
      // Manual navigation as backup
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/');
        }
      }, 100);
      
    } catch (error: any) {
      console.error('Login failed:', error);
      // Error is handled by the store and displayed via error state
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
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
            <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
            <Text className="text-gray-600 text-center">
              Sign in to your GeMora account
            </Text>
          </View>

          {/* Login Form */}
          <View className="space-y-6">
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
              placeholder="Enter your password"
              secureTextEntry
              autoComplete="password"
              error={passwordError}
            />

            {/* Error Message */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Text className="text-red-700 text-sm text-center">
                  {error}
                </Text>
              </View>
            )}

            {/* Login Button */}
            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              className="w-full mt-6"
            />

            {/* Forgot Password Link */}
            <TouchableOpacity className="items-center mt-4">
              <Text className="text-green-600 font-medium">
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-green-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
