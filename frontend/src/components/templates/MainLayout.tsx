import React from 'react';
import { Header, Footer } from '../organisms';

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
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.15),transparent),radial-gradient(1200px_600px_at_90%_10%,rgba(16,185,129,0.12),transparent)]">
      <Header title={title} onSearch={onSearch} />
      
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-12 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
