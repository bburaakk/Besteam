import React from 'react';
import { SignupForm, FeaturesShowcase } from '../components/organisms';
import { SignupHeader, TrustIndicators } from '../components/molecules';

const SignupPage: React.FC = () => {
  const handleSignupSuccess = () => {
    // Başarılı kayıt sonrası yönlendirme yapılabilir
    // navigate('/login');
    console.log('Signup successful!');
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
          <SignupHeader />
          <SignupForm onSuccess={handleSignupSuccess} />
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

export default SignupPage;
