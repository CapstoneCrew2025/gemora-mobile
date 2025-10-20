import { apiClient } from './apiClient';

export interface ProfileData {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  selfieImageUrl: string;
  role: string;
}

export interface UpdateProfileRequest {
  name: string;
  contactNumber: string;
  selfieImage?: string; // file URI
}

class ProfileService {
  async getProfile(): Promise<ProfileData> {
    try {
      const response = await apiClient.get<ProfileData>('/profile', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw new Error('Failed to fetch profile data');
    }
  }

  async updateProfile(updateData: UpdateProfileRequest): Promise<ProfileData> {
    try {
      const formData = new FormData();
      
      formData.append('name', updateData.name);
      formData.append('contactNumber', updateData.contactNumber);
      
      if (updateData.selfieImage) {
        formData.append('selfieImage', {
          uri: updateData.selfieImage,
          type: 'image/jpeg',
          name: 'selfie.jpg',
        } as any);
      }
      
      const response = await apiClient.put<ProfileData>('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile data');
    }
  }
}

export const profileService = new ProfileService();