import { apiClient } from './client';

export interface CVAnalysisResponse {
  file_name: string;
  content: string;
  basic_score: number;
  advanced_score: number;
  final_score: number;
  found_keywords: string[];
  missing_keywords: string[];
  feedback: string;
  tips: string[];
  language: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
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
