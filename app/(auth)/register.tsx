
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
    Image,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth, useAuthActions } from '../../store/useAuthStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
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
  }, [name, email, mobile, dateOfBirth, password, confirmPassword, clearError]);

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setMobileError('');
    setDateOfBirthError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Name validation
    if (!name.trim()) {
      setNameError('Full name is required');
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

    // Mobile validation (optional but recommended)
    if (mobile.trim() && !/^[+]?[\d\s-]{10,}$/.test(mobile)) {
      setMobileError('Please enter a valid mobile number');
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
        // Add mobile and dateOfBirth if your backend supports it
        // mobile: mobile.trim(),
        // dateOfBirth: dateOfBirth.trim(),
      });
      
      console.log('Registration successful, authentication state should be updated');
      
      // Clear form fields and errors after successful registration
      setName('');
      setEmail('');
      setMobile('');
      setDateOfBirth('');
      setPassword('');
      setConfirmPassword('');
      setNameError('');
      setEmailError('');
      setMobileError('');
      setDateOfBirthError('');
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
    className="flex-1 bg-emerald-500"
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className="flex-1"
    >
      {/* Top emerald section with background image and title */}
      <View className="bg-emerald-500 pt-16 pb-8 items-center relative">
        {/* Background diamond image with opacity */}
        <View className="absolute inset-0 items-center justify-center opacity-20">
          <Image
            source={require("../../assets/images/diamond.png")}
            resizeMode="contain"
            className="w-32 h-32"
          />
        </View>
        
        {/* Create Account text on top */}
        <Text className="text-3xl font-bold text-gray-800 z-10">Create Account</Text>
      </View>

      {/* White rounded card container */}
      <View className="flex-1 bg-white rounded-t-3xl px-8 pt-10">
        {/* Register Form */}
        <View className="space-y-2">
          {/* Full Name Input */}
          <View className="mb-2">
            <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              autoCapitalize="words"
              autoComplete="name"
              error={nameError}
              className="bg-gray-50"
            />
          </View>

          {/* Email Input */}
          <View className="mb-2">
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
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

          {/* Mobile Number Input */}
          <View className="mb-2">
            <Text className="text-gray-700 font-medium mb-2">Mobile Number</Text>
            <Input
              value={mobile}
              onChangeText={setMobile}
              placeholder="+94 455 789"
              keyboardType="phone-pad"
              autoComplete="tel"
              error={mobileError}
              className="bg-gray-50"
            />
          </View>

          {/* Date of Birth Input */}
          <View className="mb-2">
            <Text className="text-gray-700 font-medium mb-2">Date Of Birth</Text>
            <Input
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="DD / MM / YYYY"
              error={dateOfBirthError}
              className="bg-gray-50"
            />
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <Text className="text-gray-700 font-medium mb-2">Password</Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="new-password"
              error={passwordError}
              className="bg-gray-50"
            />
          </View>

          {/* Confirm Password Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="new-password"
              error={confirmPasswordError}
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

          {/* NEXT Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            className="w-full bg-emerald-500 py-4 rounded-full items-center mb-4 mt-4"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">
              {isLoading ? 'Creating Account...' : 'NEXT'}
            </Text>
          </TouchableOpacity>

          {/* Already have account */}
          <View className="flex-row justify-center items-center mt-2">
            <Text className="text-gray-600 text-sm">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-emerald-500 font-semibold text-sm">Log In</Text>
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