
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { BrainCircuit, Target, Users, Zap } from 'lucide-react';
import Card from '../components/ui/Card';

const AboutPage: React.FC = () => {
  const teamMembers = [
    { name: "Dr. AI Fitness", role: "Chief AI Officer (Simulado)", imageUrl: "https://picsum.photos/seed/aihead/200/200" },
    { name: "Wellness Bot 3000", role: "Head of Nutrition AI (Simulado)", imageUrl: "https://picsum.photos/seed/aibot/200/200" },
    { name: "Coach Virtual Pro", role: "Lead Training Algorithm (Simulado)", imageUrl: "https://picsum.photos/seed/aicoach/200/200" },
  ];

  return (
    <PageWrapper title="Sobre o FitLife">
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-neutral-dark dark:text-white mb-4">Nossa Missão</h2>
          <Card>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Target size={64} className="text-primary flex-shrink-0" />
              <p className="text-lg text-neutral-DEFAULT dark:text-slate-300">
                No FitLife, nossa missão é democratizar o acesso a um estilo de vida saudável e ativo através da inteligência artificial. Acreditamos que todos merecem orientação personalizada e de alta qualidade para alcançar seus objetivos de bem-estar, independentemente de sua localização, tempo disponível ou nível de experiência. Buscamos capacitar indivíduos a transformar suas vidas, tornando o fitness e a nutrição acessíveis, adaptáveis e motivadores.
              </p>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-neutral-dark dark:text-white mb-4">Como a IA Transforma Sua Experiência</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-start gap-4">
                <BrainCircuit size={40} className="text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-neutral-dark dark:text-white mb-1">Inteligência Adaptativa</h3>
                  <p className="text-neutral-DEFAULT dark:text-slate-300">Nossos algoritmos aprendem com seu progresso e feedback, ajustando continuamente seus planos de treino e nutrição para otimizar resultados e manter você desafiado e engajado.</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-4">
                <Zap size={40} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-neutral-dark dark:text-white mb-1">Suporte Imediato</h3>
                  <p className="text-neutral-DEFAULT dark:text-slate-300">Com nosso chatbot IA disponível 24/7, você obtém respostas rápidas para suas dúvidas, dicas instantâneas e motivação sempre que precisar, diretamente no seu bolso.</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-neutral-dark dark:text-white mb-6 text-center">Nossa Equipe (Simulada) de IA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map(member => (
              <Card key={member.name} className="text-center">
                <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg border-2 border-primary" />
                <h3 className="text-xl font-semibold text-neutral-dark dark:text-white">{member.name}</h3>
                <p className="text-primary dark:text-primary-light">{member.role}</p>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="text-center">
            <h2 className="text-2xl font-semibold text-neutral-dark dark:text-white mb-4">Junte-se à Revolução Fitness com IA!</h2>
            <p className="text-lg text-neutral-DEFAULT dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Estamos comprometidos em usar a tecnologia para criar um futuro mais saudável e feliz. FitLife é mais que um app; é seu parceiro inteligente na jornada para uma vida melhor.
            </p>
        </section>

      </div>
    </PageWrapper>
  );
};

export default AboutPage;
    