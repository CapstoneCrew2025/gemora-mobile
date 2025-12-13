import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEV_SERVER_IP } from './apiClient';

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  success: boolean;
  response: string;
  error?: string;
}

class ChatbotService {
  private baseUrl = `http://${DEV_SERVER_IP}:8080/api`;

  /**
   * Send a message to the AI chatbot
   */
  async askQuestion(message: string): Promise<ChatbotResponse> {
    try {
      // Get JWT token
      const token = await AsyncStorage.getItem('auth_token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const requestBody: ChatbotRequest = {
        message: message,
      };

      const response = await fetch(`${this.baseUrl}/ai/ask`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // Get the response as text first
      const responseText = await response.text();
      
      // Try to parse as JSON, if it fails, treat it as plain text
      try {
        const data = JSON.parse(responseText);
        
        // Handle different JSON response formats
        if (typeof data === 'string') {
          return {
            success: true,
            response: data,
          };
        } else if (data.response) {
          return {
            success: true,
            response: data.response,
          };
        } else {
          return {
            success: true,
            response: JSON.stringify(data),
          };
        }
      } catch (parseError) {
        // If JSON parsing fails, the response is plain text
        return {
          success: true,
          response: responseText,
        };
      }
    } catch (error: any) {
      console.error('Error asking chatbot:', error);
      return {
        success: false,
        response: '',
        error: error.message || 'Failed to get response from AI. Please try again.',
      };
    }
  }
}

export const chatbotService = new ChatbotService();
export default chatbotService;
