import { apiClient } from './client';

export interface CVAnalysisResponse {
  success: boolean;
  feedback: string;
  keywords: {
    found: string[];
    missing: string[];
  };
  user_id: number;
  filename: string;
}

export const cvService = {
  analyzeCV: async (file: File): Promise<CVAnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<CVAnalysisResponse>('/api/cv/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};
