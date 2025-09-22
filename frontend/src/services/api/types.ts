// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Auth API Types
export interface SignupRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface LoginRequest {
  email_or_username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    biography?: string;
    created_at: string;
    updated_at: string;
  };
  access_token: string;
  token_type: string;
}

// User Profile Types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  bio?: string;
  skills?: string[];
}

// Project Types
export interface Project {
  id: number;
  title: string;
  description: string;
}

export interface ProjectLevel {
  level_name: string;
  projects: Project[];
}

export interface ProjectLevelsResponse {
  project_levels: ProjectLevel[];
}

export interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export interface ProjectEvaluationResponse {
  message?: string;
  evaluation_id?: string;
  score?: number;
  projeAmaci?: string;
  genelDegerlendirme?: string;
  olumluYonler?: string[];
  gelistirilebilecekYonler?: string[];
  ogrenmeTavsiyesi?: string;
  project_id?: number;
}
