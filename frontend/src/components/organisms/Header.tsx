import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../atoms';

interface HeaderProps {
  title: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  className = '',
}) => {
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

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Giriş Yap
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="group relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="relative z-10">Hemen Başla</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
