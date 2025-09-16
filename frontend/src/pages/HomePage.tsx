import React from 'react';
import { MainLayout } from '../components/templates';
import { 
  HeroSection, 
  FeaturesGrid, 
  Timeline, 
  TestimonialsSection, 
  CTASection 
} from '../components/sections';

const HomePage: React.FC = () => {
  return (
    <MainLayout title="Yolcu">
      <HeroSection />
      <FeaturesGrid />
      <Timeline />
      <TestimonialsSection />
      <CTASection />
    </MainLayout>
  );
};

export default HomePage;