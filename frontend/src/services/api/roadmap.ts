import { apiClient } from './client';

export interface RoadmapRequest {
  field: string;
}

export interface RoadmapResponse {
  // Define the expected response structure based on your API
  id: string;
  field: string;
  content: string;
  createdAt: string;
}

export const roadmapService = {
  generateRoadmap: async (data: RoadmapRequest): Promise<RoadmapResponse> => {
    const response = await apiClient.post<RoadmapResponse>('/api/roadmaps/generate', data);
    return response.data;
  },
};
