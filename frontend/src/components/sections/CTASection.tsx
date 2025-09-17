import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA Card */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-purple-600 p-8 sm:p-12 lg:p-16 text-center">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 text-white/20 text-4xl sm:text-6xl">✨</div>
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 text-white/20 text-3xl sm:text-4xl">🚀</div>
          <div className="absolute top-1/4 right-1/4 text-white/10 text-2xl sm:text-3xl">⭐</div>
          
          <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-white font-bold text-xs sm:text-sm">Şimdi Başla • Ücretsiz</span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight">
                Kariyerinde Yeni Bir
                <br />
                <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Sayfa Aç
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
                10,000+ kullanıcı Yolcu ile hayallerindeki işe kavuştu. 
                <span className="font-bold text-yellow-200"> Sıra sende!</span>
              </p>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto py-6 sm:py-8">
              {[
                { number: '85%', label: 'Ortalama ATS Artışı', icon: '📈' },
                { number: '2 Ay', label: 'Ortalama İş Bulma Süresi', icon: '⚡' },
                { number: '10K+', label: 'Başarılı Mezun', icon: '🎯' }
              ].map((stat, i) => (
                <div key={i} className="text-center bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                  <div className="text-xl sm:text-2xl mb-2">{stat.icon}</div>
                  <div className="text-xl sm:text-2xl font-black text-white mb-1">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button 
                onClick={() => navigate('/signup')}
                className="group relative px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-white text-primary font-black text-base sm:text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 w-full sm:w-auto sm:min-w-[200px]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Hemen Ücretsiz Başla
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button className="group px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur border-2 border-white/30 text-white font-bold text-base sm:text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 w-full sm:w-auto sm:min-w-[200px]">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Demo İzle
                </span>
              </button>
            </div>
            
           
          </div>
        </div>
        
      
      </div>
    </section>
  );
};

export default CTASection;
