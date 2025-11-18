import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

// Development server IP configuration
export const DEV_SERVER_IP = '172.20.10.5';
export const BACKEND_IMAGE_SERVER_IP = '192.168.8.101'; 

export const getAccessibleImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;
  
  // If it's a relative path (starts with /), prepend the backend server URL
  if (imageUrl.startsWith('/')) {
    const fullUrl = `http://${DEV_SERVER_IP}:8080${imageUrl}`;
    console.log('Converting relative path to full URL:', imageUrl, '->', fullUrl);
    return fullUrl;
  }
  
  // If it contains the old backend IP, replace it with the new one
  if (imageUrl.includes(BACKEND_IMAGE_SERVER_IP)) {
    const convertedUrl = imageUrl.replace(BACKEND_IMAGE_SERVER_IP, DEV_SERVER_IP);
    console.log('Replacing backend IP:', imageUrl, '->', convertedUrl);
    return convertedUrl;
  }
  
  // Otherwise return as-is
  console.log('Using image URL as-is:', imageUrl);
  return imageUrl;
};

const getBaseUrl = () => {
  if (__DEV__) {
    // For development - you need to replace this with your actual IP address
    // To find your IP: 
    // Windows: ipconfig | findstr IPv4
    // Mac/Linux: ifconfig | grep inet
    
    // Option 1: Use your computer's IP address (recommended for Expo)
    // Replace 192.168.1.100 with your actual IP address

    const YOUR_IP = '172.20.10.5'; // Updated to current machine IP


  
    
    if (Platform.OS === 'android') {
      return `http://${YOUR_IP}:8080/api`;
    } else if (Platform.OS === 'ios') {
      return `http://${YOUR_IP}:8080/api`;
    } else {
      return 'http://localhost:8080/api';
    }
  }
  return 'https://your-api-domain.com/api';
};

const BASE_URL = getBaseUrl(); 

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000, // Reduced to 10 seconds for faster feedback
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_role');
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
    try {
      const response = await this.instance.post<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
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

  public setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public clearAuthToken() {
    delete this.instance.defaults.headers.common['Authorization'];
  }
}


export const apiClient = new ApiClient();
export default apiClient;