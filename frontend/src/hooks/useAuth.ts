import { useState, useCallback } from 'react';
import { authService, handleApiError } from '../services';
import type { SignupRequest, LoginRequest } from '../services';

export interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  signup: (data: SignupRequest) => Promise<boolean>;
  login: (data: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  clearMessages: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const signup = useCallback(async (data: SignupRequest): Promise<boolean> => {
    setIsLoading(true);
    clearMessages();

    try {
      await authService.signup(data);
      setSuccess('Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.');
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearMessages]);

  const login = useCallback(async (data: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    clearMessages();

    try {
      await authService.login(data);
      setSuccess('Giriş başarılı. Yönlendiriliyorsunuz...');
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearMessages]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    clearMessages();

    try {
      await authService.logout();
      setSuccess('Başarıyla çıkış yapıldı.');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [clearMessages]);

  return {
    isLoading,
    error,
    success,
    signup,
    login,
    logout,
    clearMessages,
  };
};
