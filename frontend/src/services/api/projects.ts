import { apiClient } from './client';
import type { ProjectLevelsResponse, ProjectEvaluationResponse } from './types';

export const projectService = {
  // Proje seviyelerini ve projelerini getir
  getProjectLevels: async (): Promise<ProjectLevelsResponse> => {
    const response = await apiClient.get<ProjectLevelsResponse>('https://besteam.onrender.com/project-suggestions');
    return response.data;
  },

  // Proje değerlendirmesi için dosya gönder
  evaluateProject: async (projectId: number, file: File): Promise<ProjectEvaluationResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ProjectEvaluationResponse>(
      `https://besteam.onrender.com/api/projects/${projectId}/evaluate`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
