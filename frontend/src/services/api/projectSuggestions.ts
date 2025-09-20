import { apiClient } from './client';

export interface ProjectSuggestion {
  title: string;
  description: string;
}

export interface ProjectSuggestionsResponse {
  suggestions: ProjectSuggestion[];
}

export const projectSuggestionsService = {
  getProjectSuggestions: async (): Promise<ProjectSuggestionsResponse> => {
    const response = await apiClient.get<ProjectSuggestionsResponse>('/project-suggestions');
    return response.data;
  },
};
