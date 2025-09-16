import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, FeaturesShowcase } from '../components/organisms';
import { TrustIndicators } from '../components/molecules';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Başarılı giriş sonrası ana sayfaya yönlendirme
    navigate('/');
    console.log('Login successful!');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-purple-50/50 to-emerald-50/30 relative overflow-hidden lg:min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-gradient-to-bl from-emerald-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse-delayed" />
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Header with Login specific content */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-r from-primary to-primary-600 flex items-center justify-center mb-6 shadow-2xl">
              <span className="text-white text-2xl font-black">Y</span>
            </div>
            
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Tekrar Hoşgeldin
              </span>
            </h2>
            
            <p className="text-gray-600 text-lg">
              Kariyerinde kaldığın yerden devam et
            </p>
          </div>

          <LoginForm onSuccess={handleLoginSuccess} />
          <TrustIndicators />
        </div>
      </div>

      {/* Right Column - Features Showcase */}
      <div className="flex-1 lg:min-h-screen">
        <FeaturesShowcase />
      </div>
    </div>
  );
};

export default LoginPage;
