// Export API services
export { authService } from './auth';
export { roadmapService } from './roadmap';
export { cvService } from './cv';
export { summaryService } from './summary';
export { projectSuggestionsService } from './projectSuggestions';
export { motivationalService } from './motivational';
export { projectService } from './projects';

// Export API client
export { apiClient } from './client';

// Export types
export type * from './types';
export type * from './roadmap';
export type * from './cv';
export type * from './summary';
export type * from './projectSuggestions';
export type * from './motivational';

// Export utilities
export { handleApiError, extractApiData } from './utils';
