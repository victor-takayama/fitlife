


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WorkoutGeneratorForm from './WorkoutGeneratorForm';
import WorkoutDisplay from './WorkoutDisplay';
import { WorkoutPlan } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
// Fix: Replaced ClockRewind with History as ClockRewind is not available in lucide-react
import { ListChecks, PlusCircle, History } from 'lucide-react';
import LoadingSpinner from '../../ui/LoadingSpinner';

// Simulate fetching saved plans or history
const getMockSavedPlans = (): WorkoutPlan[] => [
    // Add a couple of mock plans if needed for initial state
    // Example:
    // { id: 'saved-plan-1', name: 'Meu Plano Favorito de Força', fitnessLevel: FitnessLevel.Intermediate, goals: ['Ganhar força'], days: [/* ... */] }
];

const DashboardWorkouts: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<WorkoutPlan[]>(getMockSavedPlans());
  const [view, setView] = useState<'generate' | 'current' | 'history'>('current'); // 'current' shows currentPlan or prompts generation
  const [isLoadingPlan, setIsLoadingPlan] = useState(false); // For initial load or switching plans

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'generate') {
      setView('generate');
    } else if (currentPlan) {
        setView('current');
    } else if (savedPlans.length > 0) {
        setCurrentPlan(savedPlans[0]); // Load first saved plan if no current one
        setView('current');
    } else {
        setView('generate'); // Default to generator if no plans exist
    }
    // Fix: Added currentPlan and savedPlans to dependency array
  }, [location.search, currentPlan, savedPlans]);


  const handlePlanGenerated = (plan: WorkoutPlan) => {
    setCurrentPlan(plan);
    setSavedPlans(prev => [plan, ...prev.filter(p => p.id !== plan.id)]); // Add or update plan
    setView('current');
  };

  const handleSelectPlanFromHistory = (plan: WorkoutPlan) => {
    setIsLoadingPlan(true);
    // Simulate loading time
    setTimeout(() => {
        setCurrentPlan(plan);
        setView('current');
        setIsLoadingPlan(false);
    }, 500);
  };

  const renderContent = () => {
    if (isLoadingPlan) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
    }

    if (view === 'generate') {
      return <WorkoutGeneratorForm onPlanGenerated={handlePlanGenerated} />;
    }
    if (view === 'current' && currentPlan) {
      return <WorkoutDisplay plan={currentPlan} />;
    }
    if (view === 'current' && !currentPlan) {
        return (
            <Card className="text-center p-8">
                <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-3">Nenhum plano de treino ativo.</h3>
                <p className="text-neutral-DEFAULT dark:text-slate-300 mb-6">Gere um novo plano personalizado com nossa IA ou carregue um de seus planos salvos.</p>
                <Button onClick={() => setView('generate')} leftIcon={PlusCircle}>Gerar Novo Plano</Button>
            </Card>
        );
    }
    if (view === 'history') {
      return (
        <Card>
          <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4">Histórico de Planos</h3>
          {savedPlans.length > 0 ? (
            <ul className="space-y-3">
              {savedPlans.map(plan => (
                <li key={plan.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium text-neutral-dark dark:text-white">{plan.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{plan.fitnessLevel} - {plan.goals.join(', ')}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleSelectPlanFromHistory(plan)}>Carregar Plano</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-DEFAULT dark:text-slate-300">Você ainda não tem planos de treino salvos.</p>
          )}
        </Card>
      );
    }
    return null; // Should not happen
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
        <Button 
            // Fix: Simplified condition for variant prop.
            variant={view === 'current' ? 'primary' : 'ghost'} 
            onClick={() => setView('current')}
            leftIcon={ListChecks}
        >
            Plano Atual
        </Button>
        <Button 
            variant={view === 'generate' ? 'primary' : 'ghost'} 
            onClick={() => setView('generate')}
            leftIcon={PlusCircle}
        >
            Gerar Novo Plano
        </Button>
        <Button 
            variant={view === 'history' ? 'primary' : 'ghost'} 
            onClick={() => setView('history')}
            // Fix: Replaced ClockRewind with History
            leftIcon={History}
        >
            Histórico
        </Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default DashboardWorkouts;
