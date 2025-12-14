import { apiClient } from './apiClient';

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface CreateTicketResponse {
  message: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  adminReply: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
}

class TicketService {
  /**
   * Create a new support ticket
   */
  async createTicket(ticketData: CreateTicketRequest): Promise<CreateTicketResponse> {
    try {
      const response = await apiClient.post<CreateTicketResponse>('/tickets', ticketData);
      return response;
    } catch (error: any) {
      console.error('Failed to create ticket:', error);
      throw new Error(error.response?.data?.message || 'Failed to create ticket');
    }
  }

  /**
   * Get all tickets created by the current user
   */
  async getMyTickets(): Promise<Ticket[]> {
    try {
      const response = await apiClient.get<Ticket[]>('/tickets/my');
      return response;
    } catch (error: any) {
      console.error('Failed to fetch tickets:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
}

export const ticketService = new TicketService();
