import React from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: (
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    title: 'AI Destekli CV Analizi',
    description: 'CV\'ni ATS uyumlu hale getir, eksik becerilerini keşfet'
  },
  {
    icon: (
      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
    ),
    title: 'Kişisel Yol Haritası',
    description: 'Hedefine özel öğrenme planı ve proje önerileri'
  },
  {
    icon: (
      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
    ),
    title: 'Gerçek Proje Deneyimi',
    description: 'Sektörden projelerle portfolyonu güçlendir'
  }
];

const FeaturesShowcase: React.FC = () => {
  return (
    <div className="relative h-full min-h-[600px] lg:min-h-screen flex flex-col justify-center bg-gradient-to-br from-primary via-primary-600 to-purple-600 text-white p-6 sm:p-8 lg:p-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 h-32 w-32 bg-white rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 h-40 w-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 h-24 w-24 bg-white rounded-full blur-xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto lg:mx-0">
        {/* Header */}
        <div className="mb-8 lg:mb-12 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Kariyerinde
            <br />
            Zirveye Yürü
          </h2>
          <p className="text-lg lg:text-xl opacity-90 leading-relaxed">
            AI destekli analiz, kişisel yol haritası ve
            <br className="hidden sm:block" />
            gerçek projelerle hayalindeki işe ulaş
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6 lg:space-y-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 group"
            >
              <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-bold mb-2 group-hover:text-yellow-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed text-sm lg:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default FeaturesShowcase;
