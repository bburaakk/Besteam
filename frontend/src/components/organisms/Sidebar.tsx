import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5zM8 15h8" />
        </svg>
      ),
      path: '/dashboard',
    },
    {
      id: 'cv-analysis',
      label: 'CV Analizi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/cv-analysis',
    },
    {
      id: 'roadmap',
      label: 'Yol Haritası',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      path: '/roadmap',
    },
    {
      id: 'project-suggestions',
      label: 'Proje Önerileri',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      path: '/project-suggestions',
    },
    {
      id: 'hackathons',
      label: 'Hackathonlar',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M8 21h8M12 17v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 4h10a1 1 0 011 1v2a5 5 0 01-5 5h-2A5 5 0 017 7V5a1 1 0 011-1z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 7H5a3 3 0 000 6h1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 7h1a3 3 0 010 6h-1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 4l.5-1.5M15 4l-.5-1.5M12 4l0-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: '/hackathons',
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      path: '/profile',
    },
    // settings removed
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-40 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto border-r border-slate-700/50 ${
          isCollapsed ? 'lg:w-16' : 'w-60'
        } flex flex-col lg:min-h-screen`}
      >
        {/* Header */}
        <div className={`flex items-center p-6 border-b border-slate-700/50 relative ${isCollapsed && isDesktop ? 'justify-center' : 'justify-between'}`}>
          {isCollapsed && isDesktop ? (
            /* Centered logo when collapsed - desktop only */
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xs">Y</span>
            </div>
          ) : (
            /* Logo and text when expanded or mobile */
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg ring-2 ring-white/10">
                <span className="text-white font-black text-sm">Y</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Yolcu</h2>
                <p className="text-xs text-slate-400">Kariyer Platformu</p>
              </div>
            </div>
          )}
          
          {/* Collapse/Expand button for desktop - always visible */}
          {!isCollapsed && isDesktop && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors group"
            >
              <div className="relative">
                <div className="w-5 h-5 flex flex-col justify-center items-center transition-all duration-300">
                  <div className="w-4 h-0.5 bg-slate-400 group-hover:bg-blue-400 transition-all duration-300 mb-1"></div>
                  <div className="w-4 h-0.5 bg-slate-400 group-hover:bg-blue-400 transition-all duration-300"></div>
                </div>
              </div>
            </button>
          )}
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <div className="w-4 h-0.5 bg-slate-400 rotate-45 translate-y-0.5"></div>
              <div className="w-4 h-0.5 bg-slate-400 -rotate-45 -translate-y-0.5"></div>
            </div>
          </button>
        </div>

        

        {/* Expand button when collapsed - desktop only */}
        {isCollapsed && isDesktop && (
          <div className="p-4">
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full p-2 rounded-lg hover:bg-slate-700/50 transition-colors group flex justify-center"
              title="Genişlet"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full flex items-center ${isCollapsed && isDesktop ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 text-left rounded-xl transition-all duration-200 group relative ${
                isActiveRoute(item.path)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
              title={isCollapsed && isDesktop ? item.label : undefined}
            >
              <span className={`transition-colors ${isActiveRoute(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}>
                {item.icon}
              </span>
              {(!isCollapsed || !isDesktop) && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {isActiveRoute(item.path) && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed && isDesktop ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 group`}
            title={isCollapsed && isDesktop ? 'Çıkış Yap' : undefined}
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {(!isCollapsed || !isDesktop) && <span className="font-medium">Çıkış Yap</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;