
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { Zap, Users, Activity } from 'lucide-react';
import { ROUTES } from '../../constants';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary via-sky-600 to-indigo-700 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {/* Decorative background pattern or subtle image */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="heroPattern" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="rotate(45)"><rect width="100%" height="100%" fill="rgba(255,255,255,0.05)"/><path d="M0 40 h80 M40 0 v80" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#heroPattern)"/></svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold !leading-tight tracking-tight mb-6 animate-fade-in" style={{ lineHeight: '1.2' }}>
          Transforme Sua Vida com <span className="text-accent-light">IA Personalizada</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-sky-100 mb-10 animate-fade-in animation-delay-200">
          FitLife usa inteligência artificial avançada para criar planos de treino e nutrição sob medida, ajudando você a alcançar seus objetivos de forma mais rápida e eficiente.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in animation-delay-400">
          <Link to={ROUTES.REGISTER}>
            <Button size="lg" variant="accent" className="shadow-lg hover:shadow-xl transform hover:scale-105">
              Avaliação Gratuita
            </Button>
          </Link>
          <Link to={ROUTES.PLANS}>
            <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10">
              Ver Planos
            </Button>
          </Link>
        </div>

        {/* Placeholder for video/animation - simple image for now */}
        <div className="mt-16 max-w-3xl mx-auto aspect-video rounded-xl shadow-2xl overflow-hidden animate-slide-in-bottom animation-delay-600">
          <img 
            src="https://picsum.photos/seed/fitlifehero/1280/720" 
            alt="Demonstração FitLife IA" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-md">
            <Users size={40} className="text-accent-light mb-3" />
            <div className="text-3xl font-bold">10,000+</div>
            <div className="text-sky-200">Usuários Ativos</div>
          </div>
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-md">
            <Activity size={40} className="text-accent-light mb-3" />
            <div className="text-3xl font-bold">500,000+</div>
            <div className="text-sky-200">Workouts Realizados</div>
          </div>
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-md">
            <Zap size={40} className="text-accent-light mb-3" />
            <div className="text-3xl font-bold">95%</div>
            <div className="text-sky-200">Satisfação com IA</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
    