import { apiClient } from './apiClient';

export interface ProfileData {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  selfieImageUrl: string;
  role: string;
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

  async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileData> {
    throw new Error('Update profile API not yet implemented');
  }
}

export const profileService = new ProfileService();