import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEV_SERVER_IP } from './apiClient';

export interface PredictResponse {
  success: boolean;
  confidence: number;
  gem_type: string | null;
  error: string | null;
}

class PredictService {
  private baseUrl = `http://${DEV_SERVER_IP}:8080/api`;

  /**
   * Predict gem type from an image file
   */
  async predictGem(imageUri: string): Promise<PredictResponse> {
    try {
      const formData = new FormData();
      
      // Extract filename from URI
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // Append the file to FormData
      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      // Get JWT token
      const token = await AsyncStorage.getItem('auth_token');
      
      const headers: HeadersInit = {
        'Content-Type': 'multipart/form-data',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        body: formData,
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PredictResponse = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error predicting gem:', error);
      // Return error response format
      return {
        success: false,
        confidence: 0.0,
        gem_type: null,
        error: error.message || 'Failed to predict gem type. Please try again.',
      };
    }
  }
}

export const predictService = new PredictService();
export default predictService;
