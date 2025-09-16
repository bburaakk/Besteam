import React from 'react';

interface Feature {
  title: string;
  desc: string;
  icon: string;
  color: string;
  details: string[];
}

const features: Feature[] = [
  {
    title: 'AI CV Analizi',
    desc: 'ATS uyumlu, detaylı geri bildirim',
    icon: '📊',
    color: 'from-primary to-primary-600',
    details: ['ATS uyumluluk skoru', 'Anahtar kelime analizi', 'Sektör karşılaştırması']
  },
  {
    title: 'Kişisel Roadmap',
    desc: 'Hedefine özel öğrenme yolu',
    icon: '🎯',
    color: 'from-emerald-400 to-emerald-600',
    details: ['Hedef odaklı plan', 'Milestone tracking', 'İlerleme raporları']
  },
  {
    title: '24/7 AI Mentor',
    desc: 'Her an yanında, soru sor öğren',
    icon: '🤖',
    color: 'from-purple-400 to-purple-600',
    details: ['Anında yanıt', 'Konu anlatımı', 'Kod incelemeleri']
  },
  {
    title: 'Gerçek Projeler',
    desc: 'Pratik yap, portfolyonu oluştur',
    icon: '💻',
    color: 'from-orange-400 to-orange-600',
    details: ['Sektör projeleri', 'AI değerlendirme', 'Otomatik portfolyo']
  },
  {
    title: 'Topluluk & Yarışmalar',
    desc: 'Hackathon, rozetler, ödüller',
    icon: '🏆',
    color: 'from-pink-400 to-pink-600',
    details: ['Haftalık hackathon', 'Başarı rozetleri', 'Leaderboard']
  },
  {
    title: 'İş Eşleştirme',
    desc: 'Profiline uygun iş önerileri',
    icon: '🎪',
    color: 'from-indigo-400 to-indigo-600',
    details: ['Akıllı eşleştirme', 'Şirket önerileri', 'Mülakat desteği']
  }
];

const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 h-32 w-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 h-40 w-40 bg-gradient-to-bl from-emerald-400/20 to-pink-400/20 rounded-full blur-2xl" />
      </div>
      
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 px-4 py-2 mb-6">
            <span className="text-sm font-bold text-primary">✨ Özellikler</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Neden 
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Yolcu</span>?
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kariyerinde fark yaratacak, <span className="font-bold text-gray-900">AI destekli</span> özelliklerle 
            başarıya giden yolda her adımda yanındayız.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, i) => (
            <div key={i} className="group relative">
              {/* Hover Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 rounded-3xl`} />
              
              {/* Card */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent group-hover:-translate-y-2">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div className={`absolute -inset-2 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-30 blur-lg rounded-2xl transition-all duration-300`} />
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                  
                  {/* Feature Details */}
                  <div className="space-y-2 pt-2">
                    {feature.details.map((detail, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm text-gray-700">
                        <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${feature.color}`} />
                        <span className="font-medium">{detail}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Learn More Link */}
                  <div className="pt-4">
                    <button className="group/btn flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all">
                      Daha Fazla
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">Tüm özellikleri keşfetmeye hazır mısın?</p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-600 text-white font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
            Ücretsiz Dene
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
