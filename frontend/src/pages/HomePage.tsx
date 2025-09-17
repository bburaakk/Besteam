import React from 'react';
import { MainLayout } from '../components/templates';
import { 
  HeroSection, 
  FeaturesGrid, 
  Timeline, 
  CTASection 
} from '../components/sections';

const HomePage: React.FC = () => {
  return (
    <MainLayout title="Yolcu">
      <HeroSection />
      <FeaturesGrid />
      <Timeline />
      <CTASection />
    </MainLayout>
  );
};

export default HomePage;