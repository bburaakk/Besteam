import React from 'react';

interface Testimonial {
  text: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  avatar: string;
  achievement: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Yolcu sayesinde 2 ayda hayalimdeki işe girdim. CV analizleri ve projeler muhteşemdi! Platform gerçekten işe yarıyor.",
    name: "Zeynep Kaya",
    role: "Frontend Developer",
    company: "Trendyol",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
    achievement: "2 ayda işe yerleşti"
  },
  {
    text: "AI mentor 7/24 yanımda. Takıldığım her konuda anında yardım alabiliyorum. Öğrenme sürecim hiç bu kadar etkili olmamıştı.",
    name: "Ahmet Yılmaz",
    role: "Data Scientist",
    company: "Getir",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    achievement: "ATS skoru %40 arttı"
  },
  {
    text: "Portfolyomdaki projeler sayesinde mülakatlar çok kolay geçti. Kesinlikle tavsiye ederim! Gerçekten fark yaratan bir platform.",
    name: "Elif Şahin",
    role: "Product Manager",
    company: "Hepsiburada",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    achievement: "12 proje tamamladı"
  },
  {
    text: "Roadmap özelliği sayesinde hangi konuları çalışacağımı biliyorum. Hedefli ilerlemek bu kadar kolaymış!",
    name: "Murat Demir",
    role: "Backend Developer",
    company: "BiTaksi",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    achievement: "6 ay içinde terfi"
  },
  {
    text: "Topluluk etkinlikleri ve hackathonlar sayesinde network'ümü genişlettim. Yeni arkadaşlıklar kurdum.",
    name: "Selin Özkan",
    role: "UX Designer",
    company: "Insider",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
    achievement: "3 hackathon kazandı"
  },
  {
    text: "İş eşleştirme özelliği sayesinde profilime uygun pozisyonları kaçırmıyorum. Çok pratik ve etkili!",
    name: "Emre Arslan",
    role: "DevOps Engineer",
    company: "Anadolu Bank",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=64&h=64&fit=crop&crop=face',
    achievement: "Maaşını %50 artırdı"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 h-96 w-96 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 bg-gradient-to-bl from-emerald-400/10 to-pink-400/10 rounded-full blur-3xl translate-x-1/2" />
      </div>
      
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 px-4 py-2 mb-6">
            <span className="text-sm font-bold text-primary">💬 Başarı Hikayeleri</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Kullanıcılarımız
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Ne Diyor</span>?
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Binlerce profesyonelin kariyerinde <span className="font-bold text-gray-900">fark yaratan</span> deneyimlerinden bazıları
          </p>
          
          {/* Overall Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400 text-lg sm:text-xl">
                {'★★★★★'.split('').map((star, i) => <span key={i} className="drop-shadow-sm">{star}</span>)}
              </div>
              <span className="text-base sm:text-lg font-bold text-gray-900">4.9/5</span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-gray-300" />
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-gray-900">2,847</div>
              <div className="text-sm text-gray-600">Değerlendirme</div>
            </div>
            <div className="hidden sm:block h-6 w-px bg-gray-300" />
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-gray-900">10,000+</div>
              <div className="text-sm text-gray-600">Mutlu Kullanıcı</div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="group relative">
              {/* Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 hover:-translate-y-2">
                {/* Rating */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex text-yellow-400 text-base sm:text-lg">
                    {'★★★★★'.split('').map((star, j) => <span key={j} className="drop-shadow-sm">{star}</span>)}
                  </div>
                  <div className="text-xs px-2 sm:px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold whitespace-nowrap">
                    {testimonial.achievement}
                  </div>
                </div>
                
                {/* Quote */}
                <blockquote className="text-gray-800 leading-relaxed mb-4 sm:mb-6 font-medium italic text-sm sm:text-base">
                  "{testimonial.text}"
                </blockquote>
                
                {/* User Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white shadow-lg" 
                    />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-base sm:text-lg truncate">{testimonial.name}</div>
                    <div className="text-primary font-medium text-sm truncate">{testimonial.role}</div>
                    <div className="text-gray-500 text-xs truncate">{testimonial.company}</div>
                  </div>
                  
                  {/* Company Badge */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium">
                      ✓
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 rounded-2xl sm:rounded-3xl -z-10" />
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 font-medium">
            Sen de onlar gibi başarılı olmak ister misin?
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-600 text-white font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
              Hemen Başla
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/90 backdrop-blur border-2 border-gray-200 text-gray-900 font-bold hover:bg-white hover:border-primary/30 transition-all duration-200">
              Daha Fazla Hikaye
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
