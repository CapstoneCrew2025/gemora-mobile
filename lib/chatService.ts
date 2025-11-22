import apiClient from './apiClient';

export interface SendMessageRequest {
  receiverId: number;
  gemId: number;
  content: string;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  senderName: string;
  receiverName: string;
  gemId: number;
  content: string;
  sentAt: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  roomId: string;
}

export interface GetChatHistoryRequest {
  otherUserId: number;
  gemId: number;
}

export interface InboxItem {
  roomId: string;
  otherUserId: number;
  gemName: string;
  gemDescription: string;
  gemId: number;
  lastMessage: string;
  lastSentAt: string;
  unreadCount: number;
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
   * Get chat history with another user for a specific gem
   */
  async getChatHistory(otherUserId: number, gemId: number): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.post<ChatMessage[]>('/chat/history', {
        otherUserId,
        gemId,
      });
      console.log('Chat history fetched successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error fetching chat history:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch chat history');
    }
  }

  /**
   * Get inbox with all conversations
   */
  async getInbox(): Promise<InboxItem[]> {
    try {
      const response = await apiClient.get<InboxItem[]>('/chat/inbox');
      console.log('Inbox fetched successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error fetching inbox:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch inbox');
    }
  }
}

export const chatService = new ChatService();
export default chatService;
