import apiClient from './apiClient';

export interface CertificateInfo {
  id: number;
  certificateNumber: string;
  issuingAuthority: string;
  issueDate: string;
  fileUrl: string;
  verified: boolean;
  uploadedAt: string;
  verifiedAt: string | null;
}

export interface ApprovedGem {
  id: number;
  name: string;
  description: string;
  category: string;
  carat: number;
  origin: string;
  certificationNumber: string | null;
  price: number;
  status: string;
  listingType: string;
  createdAt: string;
  updatedAt: string;
  sellerId: number;
  imageUrls: string[];
  certificates: CertificateInfo[];
}

class GemMarketService {
  /**
   * Get all approved gems from the marketplace
   */
  async getApprovedGems(): Promise<ApprovedGem[]> {
    try {
      const response = await apiClient.get<ApprovedGem[]>('/gems/approved');
      console.log('Approved gems fetched successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error fetching approved gems:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch approved gems');
    }
  }

  /**
   * Get a single gem by ID
   */
  async getGemById(id: number): Promise<ApprovedGem> {
    try {
      const response = await apiClient.get<ApprovedGem>(`/gems/${id}`);
      console.log('Gem details fetched successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error fetching gem details:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch gem details');
    }
  }
}

export const gemMarketService = new GemMarketService();
export default gemMarketService;
