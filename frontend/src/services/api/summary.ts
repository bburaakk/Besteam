import { apiClient } from './client';

export interface SummaryResponse {
  roadmap_id: number;
  center_node: string;
  item_id: string;
  topic: string;
  summary: string;
}

export const summaryService = {
  getSummary: async (roadmapId: number, itemId: string): Promise<SummaryResponse> => {
    const response = await apiClient.get<SummaryResponse>(`/api/roadmaps/${roadmapId}/summaries?item_id=${itemId}`);
    return response.data;
  },
};
