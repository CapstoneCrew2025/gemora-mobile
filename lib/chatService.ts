import apiClient from './apiClient';

export interface SendMessageRequest {
  receiverId: number;
  content: string;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  senderName: string;
  receiverName: string;
  content: string;
  sentAt: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  roomId: string;
}

export interface GetChatHistoryRequest {
  sellerId: number;
}

class ChatService {
  /**
   * Send a message to another user
   */
  async sendMessage(data: SendMessageRequest): Promise<ChatMessage> {
    try {
      const response = await apiClient.post<ChatMessage>('/chat/send', data);
      console.log('Message sent successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }

  /**
   * Get chat history with a specific seller
   */
  async getChatHistory(sellerId: number): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.post<ChatMessage[]>('/chat/history', {
        sellerId,
      });
      console.log('Chat history fetched successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error fetching chat history:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch chat history');
    }
  }
}

export const chatService = new ChatService();
export default chatService;
