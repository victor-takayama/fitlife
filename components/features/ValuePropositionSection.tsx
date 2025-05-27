
import React from 'react';
import { VALUE_PROPOSITIONS } from '../../constants';
import Card from '../ui/Card';
import { CheckCircle } from 'lucide-react';

const ValuePropositionCard: React.FC<{ title: string; description: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; }> = ({ title, description, icon: Icon }) => (
  <Card className="h-full group hover:shadow-primary/30 dark:hover:shadow-primary-dark/30 transform hover:-translate-y-1 transition-all duration-300">
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <div className="p-3 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-colors duration-300">
        <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-2">{title}</h3>
      <p className="text-neutral-DEFAULT dark:text-slate-300 text-sm leading-relaxed">{description}</p>
    </div>
  </Card>
);


const ValuePropositionSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark dark:text-white mb-4">
            Por que escolher <span className="text-primary">FitLife</span>?
          </h2>
          <p className="text-lg text-neutral-DEFAULT dark:text-slate-300 max-w-2xl mx-auto">
            Nossa plataforma combina o melhor da inteligência artificial com uma abordagem humana para o seu bem-estar.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALUE_PROPOSITIONS.map((prop) => (
            <ValuePropositionCard
              key={prop.id}
              title={prop.title}
              description={prop.description}
              icon={prop.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
    