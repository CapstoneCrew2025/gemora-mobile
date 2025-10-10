import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
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

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Store token and role in AsyncStorage
      await this.storeAuthData(response.token, response.role);
      
      // Set token in API client for future requests
      apiClient.setAuthToken(response.token);
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting registration with:', { email: userData.email, name: userData.name });
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      console.log('Registration response received:', response);
      console.log('Response token:', response.token);
      console.log('Response role:', response.role);
      
      // Store token and role in AsyncStorage
      await this.storeAuthData(response.token, response.role);
      
      // Set token in API client for future requests
      apiClient.setAuthToken(response.token);
      
      console.log('Registration successful, returning response');
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

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Clear stored data
      await AsyncStorage.multiRemove([this.TOKEN_KEY, this.ROLE_KEY, this.USER_KEY]);
      
      // Clear token from API client
      apiClient.clearAuthToken();
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }

  /**
   * Get stored auth token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Get stored user role
   */
  async getRole(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.ROLE_KEY);
    } catch (error) {
      console.error('Error getting role:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return token !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Initialize auth state (call on app startup)
   */
  async initializeAuth(): Promise<{ isAuthenticated: boolean; role: string | null }> {
    try {
      const token = await this.getToken();
      const role = await this.getRole();
      
      if (token) {
        // Set token in API client
        apiClient.setAuthToken(token);
        return { isAuthenticated: true, role };
      }
      
      return { isAuthenticated: false, role: null };
    } catch (error) {
      console.error('Error initializing auth:', error);
      return { isAuthenticated: false, role: null };
    }
  }

  /**
   * Store authentication data
   */
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

  /**
   * Store user data
   */
  async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw new Error('Failed to store user data');
    }
  }

  /**
   * Get stored user data
   */
  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;