import apiClient from './apiClient';

export interface PlaceBidRequest {
  gemId: number;
  amount: number;
}

export interface BidResponse {
  bidId: number;
  gemId: number;
  bidderId: number;
  amount: number;
  placedAt: string;
}

class BidService {
  /**
   * Place a bid on an auction gem
   */
  async placeBid(data: PlaceBidRequest): Promise<BidResponse> {
    try {
      const response = await apiClient.post<BidResponse>('/bids/place', data);
      console.log('Bid placed successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error placing bid:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to place bid');
    }
  }

  /**
   * Get bid history for a gem (highest bid first)
   */
  async getBidHistory(gemId: number): Promise<BidResponse[]> {
    try {
      const response = await apiClient.get<BidResponse[]>(`/bids/gem/${gemId}`);
      console.log('Bid history fetched successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error fetching bid history:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch bid history');
    }
  }
}

export const bidService = new BidService();
export default bidService;
