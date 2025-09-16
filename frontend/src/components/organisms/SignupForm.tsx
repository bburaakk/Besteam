import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { FormInput, LoadingButton, Checkbox, Alert } from '../atoms';
import { useAuth, signupValidationSchema, signupInitialValues } from '../../hooks';
import type { SignupFormValues } from '../../hooks';
import type { SignupRequest } from '../../services';

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const { isLoading, error, success, signup, clearMessages } = useAuth();

  const handleSubmit = async (values: SignupFormValues) => {
    const signupData: SignupRequest = {
      first_name: values.first_name,
      last_name: values.last_name,
      username: values.username,
      email: values.email,
      password: values.password
    };

    const isSuccess = await signup(signupData);
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8">
      <Formik
        initialValues={signupInitialValues}
        validationSchema={signupValidationSchema}
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

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                id="first_name"
                name="first_name"
                label="Ad"
                placeholder="Adınız"
                errors={errors}
                touched={touched}
                required
                autoComplete="given-name"
              />

              <FormInput
                id="last_name"
                name="last_name"
                label="Soyad"
                placeholder="Soyadınız"
                errors={errors}
                touched={touched}
                required
                autoComplete="family-name"
              />
            </div>

            <FormInput
              id="username"
              name="username"
              label="Kullanıcı Adı"
              placeholder="kullanici_adi"
              errors={errors}
              touched={touched}
              required
              autoComplete="username"
            />

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="ornek@email.com"
              errors={errors}
              touched={touched}
              required
              autoComplete="email"
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                id="password"
                name="password"
                type="password"
                label="Şifre"
                placeholder="••••••••"
                errors={errors}
                touched={touched}
                required
                autoComplete="new-password"
              />

              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Şifre Tekrar"
                placeholder="••••••••"
                errors={errors}
                touched={touched}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Terms Checkbox */}
            <Checkbox
              id="terms"
              name="terms"
              errors={errors}
              touched={touched}
              label={
                <span>
                  <span className="font-medium">Kullanım Şartları</span> ve{' '}
                  <span className="font-medium">Gizlilik Politikası</span>'nı okudum ve kabul ediyorum
                </span>
              }
            />

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              loadingText="Hesap Oluşturuluyor..."
              variant="primary"
              size="lg"
              className="w-full"
            >
              Hesap Oluştur
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </LoadingButton>
          </Form>
        )}
      </Formik>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="font-bold text-primary hover:text-primary-600 transition-colors">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
