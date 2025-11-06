import apiClient from './apiClient';

export interface CreateGemRequest {
  name: string;
  description: string;
  category: string;
  carat: number;
  origin: string;
  price: number;
  listingType?: 'SALE' | 'AUCTION';
  images: string[]; // Array of image URIs
  // Certificate fields (optional)
  certificateNumber?: string;
  issuingAuthority?: string;
  issueDate?: string; // yyyy-MM-dd format
  certificateFile?: string; // Certificate file URI
}

export interface UpdateGemRequest {
  name: string;
  description: string;
  weight: number; // carat weight
  color?: string;
  clarity?: string;
  origin: string;
  price: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  images?: string[]; // Array of new image URIs (optional)
  certificates?: {
    issuer: string;
    certificateNo: string;
    issuedDate: string; // yyyy-MM-dd format
  }[];
}

export interface CertificateResponse {
  id: number;
  certificateNumber: string;
  issuingAuthority: string;
  issueDate: string;
  fileUrl: string;
  verified: boolean;
  uploadedAt: string;
  verifiedAt: string | null;
}

export interface GemResponse {
  id: number;
  name: string;
  description: string;
  category: string;
  carat: number;
  origin: string;
  certificateNumber?: string;
  price: number;
  status: string;
  listingType: string;
  createdAt: string;
  updatedAt: string;
  sellerId: number;
  imageUrls: string[];
  certificates: CertificateResponse[];
}

class GemService {
  /**
   * Create a new gem listing
   */
  async createGemListing(data: CreateGemRequest): Promise<GemResponse> {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('carat', data.carat.toString());
      formData.append('origin', data.origin);
      formData.append('price', data.price.toString());
      
      // Add optional fields
      if (data.certificateNumber) {
        formData.append('certificateNumber', data.certificateNumber);
      }
      
      if (data.issuingAuthority) {
        formData.append('issuingAuthority', data.issuingAuthority);
      }
      
      if (data.issueDate) {
        formData.append('issueDate', data.issueDate);
      }
      
      if (data.listingType) {
        formData.append('listingType', data.listingType);
      }
      
      // Add certificate file if provided
      if (data.certificateFile) {
        const filename = data.certificateFile.split('/').pop() || 'certificate.pdf';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `application/${match[1]}` : 'application/pdf';
        
        formData.append('certificateFile', {
          uri: data.certificateFile,
          name: filename,
          type: type,
        } as any);
      }
      
      // Add images
      data.images.forEach((imageUri, index) => {
        const filename = imageUri.split('/').pop() || `image_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('images', {
          uri: imageUri,
          name: filename,
          type: type,
        } as any);
      });

      const response = await apiClient.post<GemResponse>('/gems', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Gem listing created successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error creating gem listing:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create gem listing');
    }
  }

  /**
   * Update an existing gem listing
   */
  async updateGemListing(gemId: number, data: UpdateGemRequest): Promise<GemResponse> {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('weight', data.weight.toString());
      formData.append('origin', data.origin);
      formData.append('price', data.price.toString());
      formData.append('status', data.status);
      
      // Add optional fields
      if (data.color) {
        formData.append('color', data.color);
      }
      
      if (data.clarity) {
        formData.append('clarity', data.clarity);
      }
      
      // Add certificates if provided
      if (data.certificates && data.certificates.length > 0) {
        data.certificates.forEach((cert, index) => {
          formData.append(`certificates[${index}].issuer`, cert.issuer);
          formData.append(`certificates[${index}].certificateNo`, cert.certificateNo);
          formData.append(`certificates[${index}].issuedDate`, cert.issuedDate);
        });
      }
      
      // Add images if provided
      if (data.images && data.images.length > 0) {
        data.images.forEach((imageUri, index) => {
          // Handle both string URIs and image objects
          const uri = typeof imageUri === 'string' ? imageUri : (imageUri as any)?.uri;
          
          if (!uri) {
            console.warn(`Skipping invalid image at index ${index}`);
            return;
          }
          
          const filename = uri.split('/').pop() || `image_${index}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';
          
          formData.append('images', {
            uri: uri,
            name: filename,
            type: type,
          } as any);
        });
      }

      const response = await apiClient.put<GemResponse>(`/gems/${gemId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Gem listing updated successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error updating gem listing:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update gem listing');
    }
  }
}

export const gemService = new GemService();
export default gemService;
