import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { FormInput, LoadingButton, Checkbox, Alert } from '../atoms';
import { loginValidationSchema, loginInitialValues } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import { authService, handleApiError } from '../../services';
import type { LoginFormValues } from '../../hooks';
import type { LoginRequest } from '../../services';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (values: LoginFormValues) => {
    const loginData: LoginRequest = {
      email_or_username: values.email_or_username,
      password: values.password
    };

    setIsLoading(true);
    clearMessages();

    try {
      const response = await authService.login(loginData);
      
      // API'dan gelen user verisini direkt kullan
      const user = response.user;
      
      // Token'ı localStorage'a kaydet
      if (response.access_token && user) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      setUser(user);
      setSuccess('Giriş başarılı. Yönlendiriliyorsunuz...');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8">
      <Formik
        initialValues={loginInitialValues}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            {/* Success Message */}
            {success && (
              <Alert
                variant="success"
                message={success}
                onClose={clearMessages}
              />
            )}

            {/* Error Message */}
            {error && (
              <Alert
                variant="error"
                message={error}
                onClose={clearMessages}
              />
            )}

            {/* Email or Username Field */}
            <FormInput
              id="email_or_username"
              name="email_or_username"
              label="Email veya Kullanıcı Adı"
              placeholder="ornek@email.com veya kullanici_adi"
              errors={errors}
              touched={touched}
              required
              autoComplete="username"
            />

            {/* Password Field */}
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Şifre"
              placeholder="••••••••"
              errors={errors}
              touched={touched}
              required
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <Checkbox
                id="remember_me"
                name="remember_me"
                errors={errors}
                touched={touched}
                label="Beni hatırla"
              />
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
              >
                Şifremi unuttum
              </Link>
            </div>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              loadingText="Giriş yapılıyor..."
              variant="primary"
              size="lg"
              className="w-full"
            >
              Giriş Yap
             
            </LoadingButton>
          </Form>
        )}
      </Formik>

      {/* Signup Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Henüz hesabın yok mu?{' '}
          <Link to="/signup" className="font-bold text-primary hover:text-primary-600 transition-colors">
            Hesap Oluştur
          </Link>
        </p>
      </div>

    </div>
  );
};

export default LoginForm;
