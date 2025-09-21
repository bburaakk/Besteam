import { apiClient } from './client';

export interface ProjectSuggestionItem {
  title: string;
  description: string;
}

export interface ProjectSuggestionsResponse {
  suggestions: ProjectSuggestionItem[];
}

export const projectSuggestionsService = {
  getProjectSuggestions: async (): Promise<ProjectSuggestionsResponse> => {
    const response = await apiClient.get<ProjectSuggestionsResponse>('/project-suggestions');
    return response.data;
  },
};
