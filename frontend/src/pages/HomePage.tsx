import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/templates';
import { useAuth } from '../contexts/AuthContext';
import { 
  HeroSection, 
  FeaturesGrid, 
  Timeline, 
  CTASection 
} from '../components/sections';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Giriş yapan kullanıcıları dashboard'a yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <MainLayout title="Yolcu" showSidebar={false}>
      <HeroSection />
      <FeaturesGrid />
      <Timeline />
      <CTASection />
    </MainLayout>
  );
};

export default HomePage;