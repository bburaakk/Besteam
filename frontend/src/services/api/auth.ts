import { apiClient } from './client';
import type { 
  SignupRequest, 
  SignupResponse, 
  LoginRequest, 
  LoginResponse,
  ApiResponse 
} from './types';

export class AuthService {
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await apiClient.post<ApiResponse<SignupResponse>>('/signup', data);
    return (response.data.data || response.data) as SignupResponse;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/login', data);
    const result = (response.data.data || response.data) as LoginResponse;
    
    // Store token in localStorage
    if (result.access_token) {
      localStorage.setItem('authToken', result.access_token);
    }
    
    return result;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout');
    } finally {
      localStorage.removeItem('authToken');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/reset-password', { token, password });
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/verify-email', { token });
  }

  async resendVerification(email: string): Promise<void> {
    await apiClient.post('/resend-verification', { email });
  }

  // Token utilities
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }
}

export const authService = new AuthService();
