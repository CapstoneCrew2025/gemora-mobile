import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
}

export interface RegisterWithImagesRequest {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  idFrontImage: string;
  idBackImage: string;
  selfieImage: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}

export interface User {
  name?: string;
  email: string;
  role: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly USER_KEY = 'user_data';

  async testConnection(): Promise<boolean> {
    return true;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      await this.storeAuthData(response.token, response.role);
      apiClient.setAuthToken(response.token);
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async registerWithImages(userData: RegisterWithImagesRequest): Promise<AuthResponse> {
    try {
      const isConnected = await this.testConnection();
      
      if (!isConnected) {
        throw new Error('Cannot connect to server. Please check your internet connection and backend status.');
      }
      
      const formData = new FormData();
      
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('contactNumber', userData.contactNumber);
      
      formData.append('idFrontImage', {
        uri: userData.idFrontImage,
        type: 'image/jpeg',
        name: 'id_front.jpg',
      } as any);
      
      formData.append('idBackImage', {
        uri: userData.idBackImage,
        type: 'image/jpeg',
        name: 'id_back.jpg',
      } as any);
      
      formData.append('selfieImage', {
        uri: userData.selfieImage,
        type: 'image/jpeg',
        name: 'selfie.jpg',
      } as any);
      
      const response = await apiClient.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });
      
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        const responseData = response as any;
        
        if (responseData.message && responseData.token && responseData.role) {
          const authResponse: AuthResponse = {
            token: responseData.token,
            role: responseData.role,
          };

          
          await this.storeAuthData(authResponse.token, authResponse.role);
          apiClient.setAuthToken(authResponse.token);

          return authResponse;
        } else if (responseData.token && responseData.role) {
          const authResponse: AuthResponse = {
            token: responseData.token,
            role: responseData.role,
          };

          await this.storeAuthData(authResponse.token, authResponse.role);
          apiClient.setAuthToken(authResponse.token);

          return authResponse;
        } else if (responseData.message && responseData.message.toLowerCase().includes('success')) {
          const authResponse: AuthResponse = {
            token: `temp_token_${Date.now()}`,
            role: responseData.role || 'USER',
          };
          
          await this.storeAuthData(authResponse.token, authResponse.role);
          apiClient.setAuthToken(authResponse.token);
          
          return authResponse;
        } else {
          console.error('Invalid response: missing required fields', responseData);
          throw new Error(responseData.message || 'Registration failed: Invalid response format');
        }
      }
      
      // Fallback for other response formats
      console.error('Unexpected response format:', response.data);
      throw new Error('Unexpected response format from server');
    } catch (error: any) {
      console.error('=== REGISTRATION WITH IMAGES ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', JSON.stringify(error.response.headers));
        console.error('Response data:', JSON.stringify(error.response.data));
      }
      
      if (error.request) {
        console.error('Request details:', {
          url: error.request.responseURL || error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        });
      }
      
      console.error('Error code:', error.code);
      console.error('Error config:', error.config ? JSON.stringify(error.config, null, 2) : 'No config');
      console.error('=== END ERROR DETAILS ===');
      
      if (error.code === 'ECONNABORTED' && error.message?.includes('timeout')) {
        throw new Error('Request timed out. Please check if your backend server is running and try again.');
      }
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error' || error.message?.includes('Network')) {
        throw new Error('Unable to connect to server. Please check your internet connection and backend status.');
      }
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Please ensure your backend server is running on http://192.168.1.102:8080');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error(error.message || 'Registration failed');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      await this.storeAuthData(response.token, response.role);
      apiClient.setAuthToken(response.token);
      
      return response;
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }


  async logout(): Promise<void> {
    try {
   
      await AsyncStorage.multiRemove([this.TOKEN_KEY, this.ROLE_KEY, this.USER_KEY]);
      
    
      apiClient.clearAuthToken();
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }

 
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }


  async getRole(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.ROLE_KEY);
    } catch (error) {
      console.error('Error getting role:', error);
      return null;
    }
  }


  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return token !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }


  async initializeAuth(): Promise<{ isAuthenticated: boolean; role: string | null }> {
    try {
      const token = await this.getToken();
      const role = await this.getRole();
      
      if (token) {
        apiClient.setAuthToken(token);
        return { isAuthenticated: true, role };
      }
      
      return { isAuthenticated: false, role: null };
    } catch (error) {
      console.error('Error initializing auth:', error);
      return { isAuthenticated: false, role: null };
    }
  }

  private async storeAuthData(token: string, role: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [this.TOKEN_KEY, token],
        [this.ROLE_KEY, role],
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  
  async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw new Error('Failed to store user data');
    }
  }


  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async forgotPassword(email: string): Promise<{ message: string; email: string }> {
    try {
      const response = await apiClient.post<{ message: string; email: string }>(
        '/auth/forgot-password',
        { email }
      );
      return response;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send password reset OTP');
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/reset-password',
        { email, otp, newPassword }
      );
      return response;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }
}


export const authService = new AuthService();
export default authService;