import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="-mx-4 sm:-mx-6 lg:-mx-10 relative min-h-[95vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-primary/40 to-purple-500/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-500/40 to-accent/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 right-1/3 h-64 w-64 rounded-full bg-gradient-to-bl from-pink-400/20 to-orange-400/20 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left space-y-8">            
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-none">
                <span className="block bg-gradient-to-r from-gray-900 via-primary to-primary-600 bg-clip-text text-transparent">
                  Kariyerinde
                </span>
                <span className="block bg-gradient-to-r from-primary-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Zirveye Yürü
                </span>
              </h1>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-4">
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-purple-600 rounded-full" />
                <div className="h-1 w-8 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-full" />
                <div className="h-1 w-4 bg-gradient-to-r from-emerald-600 to-primary rounded-full" />
              </div>
            </div>
            
            {/* Description */}
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-2xl font-medium">
              <span className="font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">AI destekli CV analizi</span>, 
              kişiye özel yol haritası ve gerçek projelerle hayalindeki işe ulaş.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={() => navigate('/signup')}
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-primary via-primary-600 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Ücretsiz Başla
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-700 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              
            </div>
            
           
          </div>
          
            {/* Right Visual - Enhanced */}
            <div className="relative mt-16 lg:mt-0">
              <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-lg">

                {/* Enhanced Main Card */}
                <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-200/50 backdrop-blur-sm">
                  <div className="space-y-6 sm:space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900">Kariyer Analizi</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">Aktif</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Progress Bars */}
                    <div className="space-y-4 sm:space-y-6">
                      {[
                        { label: 'Teknik Beceriler', value: 88, color: 'from-primary to-primary-600' },
                        { label: 'Proje Deneyimi', value: 75, color: 'from-emerald-400 to-emerald-600' },
                        { label: 'İletişim', value: 92, color: 'from-purple-400 to-purple-600' }
                      ].map((skill, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-700">{skill.label}</span>
                            <span className="text-sm font-black text-gray-900">{skill.value}%</span>
                          </div>
                          <div className="h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`h-full bg-gradient-to-r ${skill.color} rounded-full shadow-sm transition-all duration-1000 ease-out`}
                              style={{ width: `${skill.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 sm:pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex flex-wrap gap-2">
                          {['Python', 'React', 'Node.js'].map(skill => (
                            <span key={skill} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 text-xs font-bold text-gray-700 border border-gray-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                          +5 daha
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
