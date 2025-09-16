import axios from 'axios';

// Utility functions for API error handling
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.data?.errors) {
      // Handle validation errors
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0] as string[];
      return firstError?.[0] || 'Validation error occurred';
    }
    
    switch (error.response?.status) {
      case 400:
        return 'Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.';
      case 401:
        return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
      case 403:
        return 'Bu işlem için yetkiniz bulunmuyor.';
      case 404:
        return 'İstenen kaynak bulunamadı.';
      case 409:
        return 'Bu bilgiler zaten kullanımda.';
      case 422:
        return 'Girdiğiniz bilgiler geçerli değil.';
      case 429:
        return 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.';
      case 500:
        return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
      default:
        return error.message || 'Beklenmeyen bir hata oluştu.';
    }
  }
  
  return 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.';
};

// API Response helper
export const extractApiData = <T extends object>(response: { data: T } | T): T => {
  return 'data' in response ? response.data : response;
};
