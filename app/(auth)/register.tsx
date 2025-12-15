import * as ImagePicker from 'expo-image-picker';
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
import { Input } from '../../components/common/Input';
import { useAuth, useAuthActions } from '../../store/useAuthStore';

// Type definition for registration data
interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  frontIdPhoto: string | null;
  backIdPhoto: string | null;
  selfiePhoto: string | null;
}

export default function RegisterScreen() {
  // Step management (1, 2, 3, or 4)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Registration data state
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    frontIdPhoto: null,
    backIdPhoto: null,
    selfiePhoto: null,
  });

  // Error states
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    frontIdPhoto: '',
    backIdPhoto: '',
    selfiePhoto: '',
  });

  const { isLoading, error, isAuthenticated } = useAuth();
  const { register, registerWithImages, clearError } = useAuthActions();

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Update registration data
  const updateData = (field: keyof RegistrationData, value: string | null) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
    if (error) clearError();
  };

  // Validation for Step 1
  const validateStep1 = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    // Name validation
    if (!registrationData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    } else if (registrationData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    } else {
      newErrors.name = '';
    }

    // Email validation
    if (!registrationData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Password validation
    if (!registrationData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (registrationData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    // Confirm password validation
    if (!registrationData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (registrationData.password !== registrationData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    }

    // Contact number validation
    if (!registrationData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(registrationData.contactNumber.replace(/\s/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    } else {
      newErrors.contactNumber = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  // Validation for Step 2
  const validateStep2 = (): boolean => {
    if (!registrationData.frontIdPhoto) {
      setErrors(prev => ({ ...prev, frontIdPhoto: 'Front ID photo is required' }));
      Alert.alert('Required', 'Please upload a photo of the front of your ID card');
      return false;
    }
    setErrors(prev => ({ ...prev, frontIdPhoto: '' }));
    return true;
  };

  // Validation for Step 3
  const validateStep3 = (): boolean => {
    if (!registrationData.backIdPhoto) {
      setErrors(prev => ({ ...prev, backIdPhoto: 'Back ID photo is required' }));
      Alert.alert('Required', 'Please upload a photo of the back of your ID card');
      return false;
    }
    setErrors(prev => ({ ...prev, backIdPhoto: '' }));
    return true;
  };

  // Validation for Step 4
  const validateStep4 = (): boolean => {
    if (!registrationData.selfiePhoto) {
      setErrors(prev => ({ ...prev, selfiePhoto: 'Selfie photo is required' }));
      Alert.alert('Required', 'Please take a selfie to complete registration');
      return false;
    }
    setErrors(prev => ({ ...prev, selfiePhoto: '' }));
    return true;
  };

  // Handle next button
  const handleNext = async () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (validateStep3()) {
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      if (validateStep4()) {
        await handleRegister();
      }
    }
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Handle image picker
  const pickImage = async (type: 'front' | 'back' | 'selfie') => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as any,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        if (type === 'front') {
          updateData('frontIdPhoto', imageUri);
        } else if (type === 'back') {
          updateData('backIdPhoto', imageUri);
        } else {
          updateData('selfiePhoto', imageUri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Handle camera
  const takePhoto = async (type: 'front' | 'back' | 'selfie') => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your camera');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        // Use front camera for selfie
        cameraType: type === 'selfie' ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        if (type === 'front') {
          updateData('frontIdPhoto', imageUri);
        } else if (type === 'back') {
          updateData('backIdPhoto', imageUri);
        } else {
          updateData('selfiePhoto', imageUri);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Show image picker options
  const showImagePickerOptions = (type: 'front' | 'back' | 'selfie') => {
    Alert.alert(
      type === 'selfie' ? 'Take Selfie' : 'Upload Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => takePhoto(type) },
        { text: 'Choose from Library', onPress: () => pickImage(type) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Final registration submission
  const handleRegister = async () => {
    clearError(); // Clear any previous errors
    
    try {
      // Validate that all images are present
      if (!registrationData.frontIdPhoto || !registrationData.backIdPhoto || !registrationData.selfiePhoto) {
        Alert.alert('Missing Images', 'Please upload all required images before proceeding.');
        return;
      }
      
      // Use the new registerWithImages method
      const result = await registerWithImages({
        name: registrationData.name.trim(),
        email: registrationData.email.trim().toLowerCase(),
        password: registrationData.password,
        contactNumber: registrationData.contactNumber.trim(),
        idFrontImage: registrationData.frontIdPhoto,
        idBackImage: registrationData.backIdPhoto,
        selfieImage: registrationData.selfiePhoto,
      });
      
      setRegistrationData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        frontIdPhoto: null,
        backIdPhoto: null,
        selfiePhoto: null,
      });
      setErrors({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        frontIdPhoto: '',
        backIdPhoto: '',
        selfiePhoto: '',
      });
      
      // Show success message and navigate to login page
      Alert.alert(
        'Registration Successful!', 
        'Your account has been created successfully. Please login with your credentials.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/login');
            }
          }
        ]
      );
      
    } catch (error: any) {
      console.error('Registration failed:', error);
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
        <View className="relative items-center pt-16 pb-8 bg-emerald-500">
          {/* Background diamond image with opacity */}
          <View className="absolute inset-0 items-center justify-center opacity-20">
            <Image
              source={require("../../assets/images/diamond.png")}
              resizeMode="contain"
              className="w-32 h-32"
            />
          </View>
          
          {/* Create Account text on top */}
          <Text className="z-10 text-3xl font-bold text-gray-800">Create Account</Text>
        </View>

        {/* White rounded card container */}
        <View className="flex-1 px-8 pt-10 bg-white rounded-t-3xl">
          {/* Progress Indicator - ONLY shown on steps 2, 3, and 4 */}
          {currentStep > 1 && (
            <View className="flex-row justify-center mb-8">
              <View className="flex-row items-center">
                <View className={`px-4 py-2 rounded-full ${currentStep === 2 ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <Text className={`font-semibold text-xs ${currentStep === 2 ? 'text-white' : 'text-gray-600'}`}>
                    1 FRONT
                  </Text>
                </View>
                <View className="w-6 h-0.5 bg-gray-300 mx-1" />
                <View className={`px-4 py-2 rounded-full ${currentStep === 3 ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <Text className={`font-semibold text-xs ${currentStep === 3 ? 'text-white' : 'text-gray-600'}`}>
                    2 BACK
                  </Text>
                </View>
                <View className="w-6 h-0.5 bg-gray-300 mx-1" />
                <View className={`px-4 py-2 rounded-full ${currentStep === 4 ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <Text className={`font-semibold text-xs ${currentStep === 4 ? 'text-white' : 'text-gray-600'}`}>
                    3 SELFIE
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Step Content */}
          {currentStep === 1 && (
            <Step1BasicInfo
              data={registrationData}
              errors={errors}
              updateData={updateData}
            />
          )}

          {currentStep === 2 && (
            <Step2FrontID
              userName={registrationData.name}
              frontIdPhoto={registrationData.frontIdPhoto}
              onUpload={() => showImagePickerOptions('front')}
            />
          )}

          {currentStep === 3 && (
            <Step3BackID
              userName={registrationData.name}
              backIdPhoto={registrationData.backIdPhoto}
              onUpload={() => showImagePickerOptions('back')}
            />
          )}

          {currentStep === 4 && (
            <Step4Selfie
              userName={registrationData.name}
              selfiePhoto={registrationData.selfiePhoto}
              onUpload={() => showImagePickerOptions('selfie')}
            />
          )}

          {/* Error Message */}
          {error && (
            <View className="p-3 mt-4 mb-4 border border-red-200 rounded-lg bg-red-50">
              <Text className="text-sm text-center text-red-700">
                {error}
              </Text>
            </View>
          )}

          {/* NEXT/COMPLETE Button */}
          <TouchableOpacity
            onPress={handleNext}
            disabled={isLoading}
            className="items-center w-full py-4 mt-4 mb-4 rounded-full bg-emerald-500"
            activeOpacity={0.85}
          >
            <Text className="text-base font-bold text-white">
              {isLoading ? 'Processing...' : currentStep === 4 ? 'COMPLETE' : 'NEXT'}
            </Text>
          </TouchableOpacity>

          {/* Already have account - ONLY shown on step 1 */}
          {currentStep === 1 && (
            <View className="flex-row items-center justify-center mt-2 mb-8">
              <Text className="text-sm text-gray-600">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-sm font-semibold text-emerald-500">Log In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>

        {/* Back button (top-left) */}
        <TouchableOpacity
          onPress={handleBack}
          className="absolute items-center justify-center w-10 h-10 rounded-full left-4 top-12 bg-white/20"
          activeOpacity={0.85}
        >
          <Text className="text-xl text-white">‹</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==================== STEP 1: Basic Information ====================
interface Step1Props {
  data: RegistrationData;
  errors: any;
  updateData: (field: keyof RegistrationData, value: string | null) => void;
}

function Step1BasicInfo({ data, errors, updateData }: Step1Props) {
  return (
    <View className="space-y-2">
      {/* Full Name Input */}
      <View className="mb-2">
        <Text className="mb-2 font-medium text-gray-700">Full Name</Text>
        <Input
          value={data.name}
          onChangeText={(text) => updateData('name', text)}
          placeholder="John Doe"
          autoCapitalize="words"
          autoComplete="name"
          error={errors.name}
          className="bg-gray-50"
        />
      </View>

      {/* Email Input */}
      <View className="mb-2">
        <Text className="mb-2 font-medium text-gray-700">Email</Text>
        <Input
          value={data.email}
          onChangeText={(text) => updateData('email', text)}
          placeholder="example@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          className="bg-gray-50"
        />
      </View>

      {/* Password Input */}
      <View className="mb-2">
        <Text className="mb-2 font-medium text-gray-700">Password</Text>
        <Input
          value={data.password}
          onChangeText={(text) => updateData('password', text)}
          placeholder="••••••••"
          secureTextEntry
          autoComplete="new-password"
          error={errors.password}
          className="bg-gray-50"
        />
      </View>

      {/* Confirm Password Input */}
      <View className="mb-2">
        <Text className="mb-2 font-medium text-gray-700">Confirm Password</Text>
        <Input
          value={data.confirmPassword}
          onChangeText={(text) => updateData('confirmPassword', text)}
          placeholder="••••••••"
          secureTextEntry
          autoComplete="new-password"
          error={errors.confirmPassword}
          className="bg-gray-50"
        />
      </View>

      {/* Contact Number Input */}
      <View className="mb-4">
        <Text className="mb-2 font-medium text-gray-700">Contact Number</Text>
        <Input
          value={data.contactNumber}
          onChangeText={(text) => updateData('contactNumber', text)}
          placeholder="0771234567"
          keyboardType="phone-pad"
          autoComplete="tel"
          error={errors.contactNumber}
          className="bg-gray-50"
        />
      </View>
    </View>
  );
}

// ==================== STEP 2: Front ID Photo ====================
interface Step2Props {
  userName: string;
  frontIdPhoto: string | null;
  onUpload: () => void;
}

function Step2FrontID({ userName, frontIdPhoto, onUpload }: Step2Props) {
  return (
    <View className="items-center justify-center flex-1 py-8">
      {/* Greeting */}
      <Text className="mb-8 text-2xl font-bold text-emerald-500">
        HI {userName.toUpperCase()}!
      </Text>

      {/* Instructions */}
      <Text className="mb-2 text-center text-gray-600">
        Please provide a Photo of the
      </Text>
      <Text className="mb-8 font-semibold text-center text-gray-800">
        Front of your Identity Card
      </Text>

      {/* Photo Preview or Upload Button */}
      {frontIdPhoto ? (
        <TouchableOpacity
          onPress={onUpload}
          className="w-64 h-64 mb-4 overflow-hidden border-2 rounded-2xl border-emerald-500"
          activeOpacity={0.85}
        >
          <Image
            source={{ uri: frontIdPhoto }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onUpload}
          className="items-center justify-center w-64 h-64 mb-4 bg-gray-100 border-2 border-gray-300 border-dashed rounded-2xl"
          activeOpacity={0.85}
        >
          <View className="items-center">
            <View className="items-center justify-center w-16 h-16 mb-4 rounded-full bg-emerald-500">
              <Text className="text-3xl text-white">📷</Text>
            </View>
            <Text className="font-medium text-gray-600">Tap to upload</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Upload Button */}
      <TouchableOpacity
        onPress={onUpload}
        className="flex-row items-center px-8 py-3 rounded-full bg-emerald-500"
        activeOpacity={0.85}
      >
        <View className="items-center justify-center w-6 h-6 mr-2 bg-white rounded-full">
          <Text className="text-lg text-emerald-500">📷</Text>
        </View>
        <Text className="font-bold text-white">
          {frontIdPhoto ? 'Change Photo' : 'Photo Of Front ID'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ==================== STEP 3: Back ID Photo ====================
interface Step3Props {
  userName: string;
  backIdPhoto: string | null;
  onUpload: () => void;
}

function Step3BackID({ userName, backIdPhoto, onUpload }: Step3Props) {
  return (
    <View className="items-center justify-center flex-1 py-8">
      {/* Greeting */}
      <Text className="mb-8 text-2xl font-bold text-emerald-500">
        HI {userName.toUpperCase()}!
      </Text>

      {/* Instructions */}
      <Text className="mb-2 text-center text-gray-600">
        Please provide a Photo of the
      </Text>
      <Text className="mb-8 font-semibold text-center text-gray-800">
        Back of your Identity Card
      </Text>

      {/* Photo Preview or Upload Button */}
      {backIdPhoto ? (
        <TouchableOpacity
          onPress={onUpload}
          className="w-64 h-64 mb-4 overflow-hidden border-2 rounded-2xl border-emerald-500"
          activeOpacity={0.85}
        >
          <Image
            source={{ uri: backIdPhoto }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onUpload}
          className="items-center justify-center w-64 h-64 mb-4 bg-gray-100 border-2 border-gray-300 border-dashed rounded-2xl"
          activeOpacity={0.85}
        >
          <View className="items-center">
            <View className="items-center justify-center w-16 h-16 mb-4 rounded-full bg-emerald-500">
              <Text className="text-3xl text-white">📷</Text>
            </View>
            <Text className="font-medium text-gray-600">Tap to upload</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Upload Button */}
      <TouchableOpacity
        onPress={onUpload}
        className="flex-row items-center px-8 py-3 rounded-full bg-emerald-500"
        activeOpacity={0.85}
      >
        <View className="items-center justify-center w-6 h-6 mr-2 bg-white rounded-full">
          <Text className="text-lg text-emerald-500">📷</Text>
        </View>
        <Text className="font-bold text-white">
          {backIdPhoto ? 'Change Photo' : 'Photo Of Back ID'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ==================== STEP 4: Selfie Photo ====================
interface Step4Props {
  userName: string;
  selfiePhoto: string | null;
  onUpload: () => void;
}

function Step4Selfie({ userName, selfiePhoto, onUpload }: Step4Props) {
  return (
    <View className="items-center justify-center flex-1 py-8">
      {/* Avatar placeholder using emoji instead of image */}
      <View className="items-center justify-center w-24 h-24 mb-2 rounded-full bg-emerald-100">
        <Text className="text-5xl">👤</Text>
      </View>

      {/* Greeting */}
      <Text className="mb-4 text-2xl font-bold text-emerald-500">
        HI {userName.toUpperCase()}!
      </Text>

      {/* Instructions */}
      <Text className="mb-1 text-center text-gray-600">
        Finally we just need a
      </Text>
      <Text className="mb-8 font-semibold text-center text-gray-800">
        <Text className="font-bold text-emerald-500">the Selfie </Text>
        of you straight on
      </Text>

      {/* Photo Preview or Upload Button */}
      {selfiePhoto ? (
        <TouchableOpacity
          onPress={onUpload}
          className="w-48 h-48 mb-4 overflow-hidden border-4 rounded-full border-emerald-500"
          activeOpacity={0.85}
        >
          <Image
            source={{ uri: selfiePhoto }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onUpload}
          className="items-center justify-center w-48 h-48 mb-6 bg-gray-100 border-4 border-gray-300 border-dashed rounded-full"
          activeOpacity={0.85}
        >
          <View className="items-center">
            <View className="items-center justify-center w-16 h-16 mb-2 rounded-full bg-emerald-500">
              <Text className="text-3xl text-white">🤳</Text>
            </View>
            <Text className="text-sm font-medium text-gray-600">Tap to take selfie</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Upload Button */}
      <TouchableOpacity
        onPress={onUpload}
        className="flex-row items-center px-8 py-3 rounded-full bg-emerald-500"
        activeOpacity={0.85}
      >
        <View className="items-center justify-center w-6 h-6 mr-2 bg-white rounded-full">
          <Text className="text-lg text-emerald-500">📷</Text>
        </View>
        <Text className="font-bold text-white">
          {selfiePhoto ? 'Retake Selfie' : 'Photo Of Selfie'}
        </Text>
      </TouchableOpacity>

      {/* Already have account link */}
      <View className="flex-row items-center justify-center mt-8">
        <Text className="text-sm text-gray-600">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text className="text-sm font-semibold text-emerald-500">Log In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}