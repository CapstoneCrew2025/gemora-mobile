import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

// Different base URLs for different platforms
const getBaseUrl = () => {
  if (__DEV__) {
    // For development - you need to replace this with your actual IP address
    // To find your IP: 
    // Windows: ipconfig | findstr IPv4
    // Mac/Linux: ifconfig | grep inet
    
    // Option 1: Use your computer's IP address (recommended for Expo)
    // Replace 192.168.1.100 with your actual IP address
    const YOUR_IP = '172.20.10.5'; // Your actual IP address
    
    if (Platform.OS === 'android') {
      // For Android emulator, use 10.0.2.2
      // For Android device/Expo Go, use your computer's IP
      return `http://${YOUR_IP}:8080/api`;
    } else if (Platform.OS === 'ios') {
      // For iOS simulator and device, use your computer's IP
      return `http://${YOUR_IP}:8080/api`;
    } else {
      // For web development
      return 'http://localhost:8080/api';
    }
  }
  // For production, use your actual API URL
  return 'https://your-api-domain.com/api';
};

const BASE_URL = getBaseUrl();

console.log('API Base URL:', BASE_URL); // Debug log

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token from storage:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear storage
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_role');
          // You can add navigation to login screen here if needed
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  // Method to set token manually
  public setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Method to clear token
  public clearAuthToken() {
    delete this.instance.defaults.headers.common['Authorization'];
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;