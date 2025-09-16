import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`relative bg-gray-900 text-white ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
      </div>
      
      <div className="relative z-10 px-4 sm:px-6 lg:px-10 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-primary-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">Y</span>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Yolcu</h3>
                <p className="text-xs text-gray-400">Kariyer platformu</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              AI destekli CV analizi, kişisel yol haritası ve gerçek projelerle 
              hayalinizdeki işe ulaşmanızı sağlayan modern kariyer platformu.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Takip edin:</span>
              {[
                { name: 'Twitter', icon: '🐦' },
                { name: 'LinkedIn', icon: '💼' },
                { name: 'Instagram', icon: '📷' },
                { name: 'YouTube', icon: '📺' }
              ].map(social => (
                <a 
                  key={social.name}
                  href={`#${social.name.toLowerCase()}`} 
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                  title={social.name}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              {[
                'CV Analizi',
                'Yol Haritası',
                'AI Mentor',
                'Projeler',
                'Topluluk',
                'Hackathon'
              ].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-white transition-colors hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-4">Kaynaklar</h4>
            <ul className="space-y-3 text-sm">
              {[
                'Blog',
                'Rehberler',
                'Webinarlar',
                'Başarı Hikayeleri',
                'API Dokümantasyonu',
                'Yardım Merkezi'
              ].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-white transition-colors hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-8 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Kariyer İpuçlarını Kaçırma</h3>
            <p className="text-gray-300 mb-6">Haftalık kariyer rehberi ve platform güncellemelerini al</p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Abone Ol
              </button>
            </form>
            
            <p className="text-xs text-gray-400 mt-3">
              Spam göndermiyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>© {new Date().getFullYear()} Yolcu. Tüm hakları saklıdır.</span>
              <div className="flex items-center gap-4">
                <a href="#gizlilik" className="hover:text-white transition-colors">Gizlilik</a>
                <a href="#kullanim-sartlari" className="hover:text-white transition-colors">Kullanım Şartları</a>
                <a href="#cerezler" className="hover:text-white transition-colors">Çerezler</a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <span>in Turkiye</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;