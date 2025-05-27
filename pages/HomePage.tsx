
import React from 'react';
import HeroSection from '../components/features/HeroSection';
import ValuePropositionSection from '../components/features/ValuePropositionSection';
import PricingSection from '../components/features/PricingSection';
import TestimonialCarousel from '../components/features/TestimonialCarousel';
import FaqSection from '../components/features/FaqSection';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants';
import PageWrapper from '../components/layout/PageWrapper';

const HomePage: React.FC = () => {
  return (
    // PageWrapper is not used here as HomePage defines its own top-level structure often.
    // If consistent padding/title is needed, it could be wrapped.
    // For now, HeroSection provides its own full-width experience.
    <>
      <HeroSection />
      <ValuePropositionSection />
      <PricingSection />
      <TestimonialCarousel />
      <FaqSection isPage={false} />
      
      {/* Final Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-secondary via-emerald-500 to-green-600 text-white">
        <PageWrapper>
            <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto para Começar sua Transformação?
            </h2>
            <p className="text-lg text-emerald-100 mb-8 max-w-xl mx-auto">
                Junte-se a milhares de pessoas que estão alcançando seus objetivos de saúde e bem-estar com o poder da IA.
            </p>
            <Link to={ROUTES.REGISTER}>
                <Button variant="accent" size="lg" className="shadow-lg hover:shadow-xl transform hover:scale-105">
                Crie Sua Conta Grátis Agora
                </Button>
            </Link>
            </div>
        </PageWrapper>
      </section>
    </>
  );
};

export default HomePage;
    