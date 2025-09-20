import { apiClient } from './client';

export interface RoadmapItem {
  id: string;
  name: string;
}

export interface SubNode {
  leftItems: RoadmapItem[];
  rightItems: RoadmapItem[];
  centralNodeTitle: string;
}

export interface MainStage {
  subNodes: SubNode[];
  stageName: string;
}

export interface RoadmapContent {
  mainStages: MainStage[];
  diagramTitle: string;
}

export interface RoadmapRequest {
  field: string;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  question: string;
}

export interface RoadmapResponse {
  id: number;
  user_id: number;
  content: RoadmapContent;
  created_at: string;
  updated_at: string;
}

export const roadmapService = {
  generateRoadmap: async (data: RoadmapRequest): Promise<RoadmapResponse> => {
    const response = await apiClient.post<RoadmapResponse>('/api/roadmaps/generate', data);
    return response.data;
  },

  chatWithRoadmap: async (roadmapId: number, request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>(`/api/roadmaps/${roadmapId}/chat`, request);
    return response.data;
  },
};
