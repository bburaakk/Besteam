import React from 'react';

interface Step {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

const steps: Step[] = [
  {
    id: 'analiz',
    title: 'Başlangıç Noktası',
    subtitle: 'Şu An Neredeyim?',
    description: 'AI destekli CV analizi ile güçlü ve zayıf yönlerini net gör.',
    icon: '🎯',
    color: 'from-primary to-primary-600',
    features: ['ATS uyumluluk skoru', 'Detaylı geri bildirim', 'Sektör karşılaştırması']
  },
  {
    id: 'yol-haritasi',
    title: 'Kişisel Yol Haritası',
    subtitle: 'Nereye Gideceğim?',
    description: 'Hedefine özel öğrenme rotası ve projeler.',
    icon: '🗺️',
    color: 'from-emerald-400 to-emerald-600',
    features: ['Kişiselleştirilmiş plan', 'Milestone tracking', 'İlerleme takibi']
  },
  {
    id: 'ogrenme',
    title: 'Öğrenme ve Gelişim',
    subtitle: 'Oraya Nasıl Gideceğim?',
    description: '24/7 AI mentor ve interaktif içerikler.',
    icon: '🚀',
    color: 'from-purple-400 to-purple-600',
    features: ['AI chatbot', 'Konu anlatımları', 'Adaptif sorular']
  },
  {
    id: 'uygulama',
    title: 'Uygulama ve Kanıt',
    subtitle: 'Bildiğimi Gösteriyorum',
    description: 'Gerçek projeler, AI değerlendirme, otomatik portfolyo.',
    icon: '💼',
    color: 'from-orange-400 to-orange-600',
    features: ['Gerçek projeler', 'AI değerlendirme', 'Otomatik portfolyo']
  },
  {
    id: 'topluluk',
    title: 'Motivasyon ve Topluluk',
    subtitle: 'Yalnız Değilsin',
    description: 'Rozetler, yarışmalar ve ilham veren bir topluluk.',
    icon: '🏆',
    color: 'from-pink-400 to-pink-600',
    features: ['Hackathon etkinlikleri', 'Başarı rozetleri', 'Topluluk desteği']
  }
];

const Timeline: React.FC = () => {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-gradient-to-bl from-emerald-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 px-4 py-2 mb-6">
            <span className="text-sm font-bold text-primary">🛤️ Yolculuk</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">5 Adımda</span><br/>
            Kariyer Dönüşümü
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Başarıya giden yolda her adımı planladık. Sen sadece ilerle, biz yanındayız.
          </p>
        </div>
        
        {/* Timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Connection Line - Desktop Only */}
            <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-purple-500 via-emerald-500 via-orange-500 to-pink-500 rounded-full shadow-lg" />
            
              {/* Steps */}
              {steps.map((step, index) => (
                <div key={step.id} className={`relative mb-16 sm:mb-20`}>
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex items-start gap-6">
                      {/* Icon Circle - Mobile */}
                      <div className="flex-shrink-0 relative">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-2xl shadow-2xl border-4 border-white`}>
                          {step.icon}
                        </div>
                        {/* Pulse Ring */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color} animate-ping opacity-20`} />
                        {/* Connection Line - Mobile */}
                        {index < steps.length - 1 && (
                          <div className={`absolute left-1/2 transform -translate-x-1/2 top-16 w-0.5 h-20 bg-gradient-to-b ${step.color} opacity-50`} />
                        )}
                      </div>
                      
                      {/* Content Card - Mobile */}
                      <div className="flex-1">
                        <div className="group bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2">
                          {/* Step Number */}
                          <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${step.color} px-3 py-1.5 mb-3`}>
                            <span className="text-white font-bold text-xs">ADIM {index + 1}</span>
                          </div>
                          
                          {/* Content */}
                          <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                          
                          <p className="text-base font-bold text-primary mb-2">
                            {step.subtitle}
                          </p>
                          
                          <p className="text-gray-700 leading-relaxed mb-4 font-medium text-sm">
                            {step.description}
                          </p>
                          
                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            {step.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${step.color}`} />
                                <span className="text-gray-700 font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Action Button */}
                          <button className={`group/btn inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${step.color} text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
                            Başla
                            <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center">
                    <div className={`${index % 2 === 0 ? 'justify-start' : 'justify-end'} w-full flex`}>
                      {/* Content Card - Desktop */}
                      <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8 lg:pr-12' : 'text-left pl-8 lg:pl-12 order-2'}`}>
                        <div className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2">
                          {/* Step Number */}
                          <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${step.color} px-4 py-2 mb-4`}>
                            <span className="text-white font-bold text-sm">ADIM {index + 1}</span>
                          </div>
                          
                          {/* Content */}
                          <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                          
                          <p className="text-lg font-bold text-primary mb-3">
                            {step.subtitle}
                          </p>
                          
                          <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                            {step.description}
                          </p>
                          
                          {/* Features */}
                          <div className="space-y-2 mb-6">
                            {step.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm">
                                <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${step.color}`} />
                                <span className="text-gray-700 font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Action Button */}
                          <button className={`group/btn inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${step.color} text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
                            Başla
                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Icon Circle - Desktop */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-3xl shadow-2xl border-4 border-white hover:scale-110 transition-transform cursor-pointer`}>
                          {step.icon}
                        </div>
                        
                        {/* Pulse Ring */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color} animate-ping opacity-20`} />
                      </div>
                      
                      {/* Progress Indicator - Desktop */}
                      {index < steps.length - 1 && (
                        <div className={`absolute left-1/2 transform -translate-x-1/2 top-20 w-1 h-20 bg-gradient-to-b ${step.color} opacity-50`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* Bottom Stats */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
          {[
            { number: '10,000+', label: 'Başarılı Kullanıcı', icon: '👥' },
            { number: '85%', label: 'Ortalama Artış', icon: '📈' },
            { number: '2 Ay', label: 'Ortalama Süre', icon: '⚡' }
          ].map((stat, i) => (
            <div key={i} className="text-center bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
