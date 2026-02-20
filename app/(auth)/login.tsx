import { FontAwesome } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
import { useTheme } from '../../context/ThemeContext';
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
  const { theme } = useTheme();

  const styles = useMemo(() => ({
    bg: { backgroundColor: theme.colors.background },
    header: { backgroundColor: theme.colors.primary },
    card: { backgroundColor: theme.colors.card },
    text: { color: theme.colors.text },
    subtext: { color: theme.colors.subtext },
    primary: { color: theme.colors.primary },
    border: { borderColor: theme.colors.border },
  }), [theme]);

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
      await login({
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      setEmail('');
      setPassword('');
      setEmailError('');
      setPasswordError('');
      
      clearError();
      
      // Navigate to home screen after successful login
      router.replace('/(main)/(home)');
      
    } catch (error: any) {
      console.error('Login failed:', error);
      // Error is handled by the store and displayed via error state
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    }
  };

  const handleGoogleLogin = () => { 
    Alert.alert('Google Login', 'Google authentication coming soon!');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook authentication coming soon!');
  };

 return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    className="flex-1"
    style={styles.bg}
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className="flex-1"
    >
      {/* Top emerald section with background diamond and welcome text - Increased height */}
      <View className="relative items-center pt-16 pb-12" style={styles.header}>
        {/* Background diamond image with opacity */}
        <View className="absolute inset-0 items-center justify-center opacity-15">
          <Image
            source={require("../../assets/images/diamond.png")}
            resizeMode="contain"
            className="w-40 h-40"
          />
        </View>
        
        {/* Welcome text on top of diamond */}
        <Text className="z-10 mt-4 text-3xl font-bold" style={styles.text}>Welcome</Text>
      </View>

      {/* White rounded card container with larger border radius */}
      <View className="flex-1 rounded-t-[40px] px-8 pt-10" style={styles.card}>
        {/* Login Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="mb-2 font-medium" style={styles.text}>Username Or Email</Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={emailError}
              className=""
            />
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="mb-2 font-medium" style={styles.text}>Password</Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              error={passwordError}
              className=""
            />
          </View>

          {/* Error Message */}
          {error && (
            <View className="p-3 mb-4 rounded-lg" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 1 }}>
              <Text className="text-sm text-center" style={{ color: '#b91c1c' }}>
                {error}
              </Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="items-center w-full py-4 mb-4 rounded-full"
            style={{ backgroundColor: theme.colors.primary, opacity: isLoading ? 0.8 : 1 }}
            activeOpacity={0.85}
          >
            <Text className="text-base font-bold text-white">
              {isLoading ? 'Signing In...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <Link href="/(auth)/forgot" asChild>
            <TouchableOpacity className="items-center mb-6">
              <Text className="text-sm" style={styles.subtext}>Forgot Password?</Text>
            </TouchableOpacity>
          </Link>

          {/* Divider with "or sign up with" */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px" style={{ backgroundColor: theme.colors.border }} />
            <Text className="mx-4 text-sm" style={styles.subtext}>or sign up with</Text>
            <View className="flex-1 h-px" style={{ backgroundColor: theme.colors.border }} />
          </View>

          {/* Social Login Buttons */}
          <View className="flex-row items-center justify-center mb-6">
            {/* Google */}
            <TouchableOpacity 
              className="items-center justify-center w-12 h-12 mr-4 rounded-full"
              style={{ borderWidth: 2, borderColor: theme.colors.border, backgroundColor: theme.colors.card }}
              activeOpacity={0.7}
              onPress={handleGoogleLogin}
            >
              <GoogleIcon size={24} />
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity 
              className="items-center justify-center w-12 h-12 rounded-full"
              style={{ borderWidth: 2, borderColor: theme.colors.border, backgroundColor: theme.colors.card }}
              activeOpacity={0.7}
              onPress={handleFacebookLogin}
            >
              <FontAwesome name="facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

          {/* Don't have account */}
          <View className="flex-row items-center justify-center">
            <Text className="text-sm" style={styles.subtext}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-sm font-semibold" style={{ color: theme.colors.primary }}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      {/* Back button (top-left) */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute items-center justify-center w-10 h-10 rounded-full left-4 top-12"
        activeOpacity={0.85}
        style={{ backgroundColor: '#ffffff33' }}
      >
        <Text className="text-xl text-white">‹</Text>
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>
);
}