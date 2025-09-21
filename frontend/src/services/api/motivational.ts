import { apiClient } from './client';

export interface MotivationalMessageResponse {
  message: string;
  author?: string;
  category?: string;
}

export const motivationalService = {
  getMotivationalMessage: async (): Promise<MotivationalMessageResponse> => {
    const response = await apiClient.get<MotivationalMessageResponse>('https://besteam.onrender.com/motivational-message');
    return response.data;
  },
};
