
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import PricingSection from '../components/features/PricingSection';

const PlansPage: React.FC = () => {
  return (
    <PageWrapper title="Nossos Planos">
      <p className="text-lg text-neutral-DEFAULT dark:text-slate-300 mb-12 text-center max-w-2xl mx-auto">
        Encontre o plano FitLife perfeito para suas necessidades e orçamento. Todos os planos vêm com o poder da nossa inteligência artificial para te guiar.
      </p>
      <PricingSection />
      <div className="mt-16 text-center p-8 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-2">Dúvidas sobre qual plano escolher?</h3>
        <p className="text-neutral-DEFAULT dark:text-slate-300 mb-4">
          Nossa equipe de suporte (simulada) ou nosso chatbot IA podem te ajudar a decidir qual plano se encaixa melhor nos seus objetivos.
        </p>
        {/* Button could link to FAQ or open chat */}
        <button className="text-primary dark:text-primary-light hover:underline" onClick={() => alert('Simulação: Abrindo chat de ajuda para planos.')}>
          Falar com suporte IA
        </button>
      </div>
    </PageWrapper>
  );
};

export default PlansPage;
    