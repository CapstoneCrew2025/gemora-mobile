import { FontAwesome } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Input } from '../../components/common/Input';
import { useAuth, useAuthActions } from '../../store/useAuthStore';

// Custom Google Icon Component with official colors
const GoogleIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {/* Blue */}
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    {/* Green */}
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    {/* Yellow */}
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    {/* Red */}
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </Svg>
);

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
      
      // No manual navigation - let the index page handle routing based on auth state
      
    } catch (error: any) {
      console.error('Login failed:', error);
      // Error is handled by the store and displayed via error state
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    }
  };

  const handleGoogleLogin = () => {
    // Add your Google login logic here
    console.log('Google login pressed');
    Alert.alert('Google Login', 'Google authentication coming soon!');
  };

  const handleFacebookLogin = () => {
    // Add your Facebook login logic here
    console.log('Facebook login pressed');
    Alert.alert('Facebook Login', 'Facebook authentication coming soon!');
  };

 return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    className="flex-1 bg-emerald-500"
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className="flex-1"
    >
      {/* Top emerald section with background diamond and welcome text - Increased height */}
      <View className="bg-emerald-500 pt-16 pb-12 items-center relative">
        {/* Background diamond image with opacity */}
        <View className="absolute inset-0 items-center justify-center opacity-15">
          <Image
            source={require("../../assets/images/diamond.png")}
            resizeMode="contain"
            className="w-40 h-40"
          />
        </View>
        
        {/* Welcome text on top of diamond */}
        <Text className="text-3xl font-bold text-gray-800 z-10 mt-4">Welcome</Text>
      </View>

      {/* White rounded card container with larger border radius */}
      <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-10">
        {/* Login Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Username Or Email</Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={emailError}
              className="bg-gray-50"
            />
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-gray-700 font-medium mb-2">Password</Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              error={passwordError}
              className="bg-gray-50"
            />
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <Text className="text-red-700 text-sm text-center">
                {error}
              </Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="w-full bg-emerald-500 py-4 rounded-full items-center mb-4"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">
              {isLoading ? 'Signing In...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <Link href="/(auth)/forgot" asChild>
            <TouchableOpacity className="items-center mb-6">
              <Text className="text-gray-600 text-sm">Forgot Password?</Text>
            </TouchableOpacity>
          </Link>

          {/* Divider with "or sign up with" */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">or sign up with</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login Buttons */}
          <View className="flex-row justify-center items-center mb-6">
            {/* Google */}
            <TouchableOpacity 
              className="w-12 h-12 rounded-full border-2 border-gray-300 items-center justify-center bg-white mr-4"
              activeOpacity={0.7}
              onPress={handleGoogleLogin}
            >
              <GoogleIcon size={24} />
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity 
              className="w-12 h-12 rounded-full border-2 border-gray-300 items-center justify-center bg-white"
              activeOpacity={0.7}
              onPress={handleFacebookLogin}
            >
              <FontAwesome name="facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

          {/* Don't have account */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-sm">Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-emerald-500 font-semibold text-sm">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      {/* Back button (top-left) */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-4 top-12 w-10 h-10 rounded-full bg-white/20 items-center justify-center"
        activeOpacity={0.85}
      >
        <Text className="text-white text-xl">‹</Text>
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>
);
}