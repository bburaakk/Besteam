import React, { useState } from 'react';
import { Header, Footer, Sidebar } from '../organisms';
import { useAuth } from '../../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  onSearch?: (query: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  onSearch,
}) => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.15),transparent),radial-gradient(1200px_600px_at_90%_10%,rgba(16,185,129,0.12),transparent)]">
      {/* Main content wrapper */}
      <div className="flex-1 flex">
        {/* Sidebar for authenticated users */}
        {isAuthenticated && (
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        )}
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header only for non-authenticated users */}
          {!isAuthenticated && (
            <Header 
              title={title} 
              onSearch={onSearch}
            />
          )}
          
          {/* Mobile menu button for authenticated users */}
          {isAuthenticated && !sidebarOpen && (
            <div className="lg:hidden fixed top-4 left-4 z-50">
              <button
                onClick={toggleSidebar}
                className="p-3 rounded-lg bg-slate-900/90 backdrop-blur-sm shadow-lg border border-slate-700 hover:bg-slate-800 transition-all duration-300"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <div className="w-5 h-0.5 bg-white mb-1"></div>
                  <div className="w-5 h-0.5 bg-white mb-1"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                </div>
              </button>
            </div>
          )}
          
          <main className={`flex-1 px-2 sm:px-3 lg:px-4 w-full ${isAuthenticated ? 'py-8' : 'py-8'}`}>
            {children}
          </main>
        </div>
      </div>
      
      {/* Footer at the bottom, full width */}
      <Footer />
    </div>
  );
};

export default MainLayout;
