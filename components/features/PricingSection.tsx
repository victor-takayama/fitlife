
import React, { useContext } from 'react';
import { PRICING_PLANS, ROUTES } from '../../constants';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import { SubscriptionTier } from '../../types';


const PricingCard: React.FC<{ plan: typeof PRICING_PLANS[0], onChoosePlan: (planId: SubscriptionTier) => void }> = ({ plan, onChoosePlan }) => (
  <Card className={`flex flex-col h-full ${plan.highlight ? 'border-primary dark:border-primary-light ring-2 ring-primary dark:ring-primary-light shadow-primary/20' : 'border-slate-200 dark:border-slate-700'}`}>
    {plan.highlight && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full shadow-md">
        MAIS POPULAR
      </div>
    )}
    <div className="p-6 flex-grow">
      <h3 className="text-2xl font-semibold text-neutral-dark dark:text-white mb-2">{plan.name}</h3>
      <p className="text-4xl font-bold text-primary dark:text-primary-light mb-1">
        R${plan.pricePerMonth}<span className="text-lg font-normal text-neutral-DEFAULT dark:text-slate-400">/mês</span>
      </p>
      <p className="text-sm text-neutral-DEFAULT dark:text-slate-400 mb-6">Ideal para quem busca {plan.name === 'Básico' ? 'começar com o essencial.' : plan.name === 'Premium' ? 'resultados acelerados e suporte completo.' : 'a experiência definitiva em fitness e bem-estar.'}</p>
      
      <ul className="space-y-3 mb-8 text-sm">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            {feature.included ? (
              <Check size={18} className="text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <X size={18} className="text-red-400 mr-2 flex-shrink-0" />
            )}
            <span className={feature.included ? "text-neutral-dark dark:text-slate-200" : "text-neutral-DEFAULT dark:text-slate-400 line-through"}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
    <div className="p-6 pt-0 mt-auto">
      <Button 
        variant={plan.highlight ? 'primary' : 'outline'} 
        size="lg" 
        className="w-full"
        onClick={() => onChoosePlan(plan.id)}
      >
        {plan.ctaText}
      </Button>
    </div>
  </Card>
);


const PricingSection: React.FC = () => {
  const { user, updateUserPlan } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const handleChoosePlan = (planId: SubscriptionTier) => {
    if (user) {
      updateUserPlan(planId);
      // Potentially show a toast message
      navigate(ROUTES.DASHBOARD_OVERVIEW);
    } else {
      navigate(ROUTES.REGISTER); // Redirect to register if not logged in
    }
  };

  return (
    <section id="plans" className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark dark:text-white mb-4">
            Planos Flexíveis para Todos os Perfis
          </h2>
          <p className="text-lg text-neutral-DEFAULT dark:text-slate-300 max-w-2xl mx-auto">
            Escolha o plano ideal para sua jornada de transformação. Cancele quando quiser.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} onChoosePlan={handleChoosePlan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
    