import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../molecules';
import { Heading } from '../atoms';

interface HeaderProps {
  title: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onSearch,
  className = '',
}) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  return (
    <header className={`bg-white/80 backdrop-blur-2xl sticky top-0 z-50 border-b border-gray-200/30 shadow-sm ${className}`}>
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-primary-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">Y</span>
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div>
              <Heading level={1} className="text-2xl font-black bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                {title}
              </Heading>
              <p className="text-xs text-gray-500 font-medium">Kariyer platformu</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { href: '#analiz', label: 'Analiz' },
              { href: '#yol-haritasi', label: 'Yol Haritası' },
              { href: '#ogrenme', label: 'Öğrenme' },
              { href: '#topluluk', label: 'Topluluk' }
            ].map(item => (
              <a 
                key={item.href}
                href={item.href} 
                className="relative text-sm font-medium text-gray-700 hover:text-primary transition-colors group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* CTA & Search */}
          <div className="hidden lg:flex items-center gap-4">
            {onSearch && (
              <div className="w-64">
                <SearchBar onSearch={onSearch} />
              </div>
            )}
            <button 
              onClick={() => navigate('/signup')}
              className="group relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="relative z-10">Hemen Başla</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <button
            aria-label="Menu"
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen((v) => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-200/30 bg-white/90 backdrop-blur-xl">
          <div className="px-4 sm:px-6 lg:px-10 py-6">
            <nav className="space-y-4">
              {[
                { href: '#analiz', label: 'CV Analizi' },
                { href: '#yol-haritasi', label: 'Yol Haritası' },
                { href: '#ogrenme', label: 'Öğrenme' },
                { href: '#topluluk', label: 'Topluluk' }
              ].map(item => (
                <a 
                  key={item.href}
                  onClick={() => setOpen(false)} 
                  href={item.href} 
                  className="block py-3 px-4 rounded-xl text-gray-700 hover:text-primary hover:bg-primary/5 transition-all font-medium"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={() => {
                  setOpen(false);
                  navigate('/signup');
                }}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white font-bold shadow-lg"
              >
                Hemen Başla
              </button>
            </div>
            
            {onSearch && (
              <div className="mt-4">
                <SearchBar onSearch={(q) => { setOpen(false); onSearch(q); }} />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
