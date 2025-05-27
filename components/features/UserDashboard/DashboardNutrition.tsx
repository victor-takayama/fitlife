


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NutritionPlanner from './NutritionPlanner';
import { NutritionPlan } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
// Fix: Replaced ClockRewind with History
import { Apple, ListChecks, PlusCircle, History, BookOpen } from 'lucide-react';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Input from '../../ui/Input'; // For food logging

// Simulate fetching saved plans or history
const getMockSavedNutritionPlans = (): NutritionPlan[] => [
    // Example:
    // { id: 'saved-nutrition-1', name: 'Meu Plano Nutri Equilíbrio', dailyCalorieTarget: 2200, days: [/* ... */] }
];

const FoodLogItem: React.FC<{item: {id: string, name: string, calories: number, time: string}}> = ({item}) => (
    <li className="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
        <div>
            <p className="font-medium text-sm text-neutral-dark dark:text-white">{item.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
        </div>
        <p className="text-sm text-primary dark:text-primary-light">{item.calories} kcal</p>
    </li>
);

const DashboardNutrition: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<NutritionPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<NutritionPlan[]>(getMockSavedNutritionPlans());
  const [view, setView] = useState<'current' | 'generate' | 'history' | 'log'>('current');
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  // Food Log state (simplified)
  const [foodLog, setFoodLog] = useState<{id: string, name: string, calories: number, time: string}[]>([]);
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');


  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'generate_plan') {
      setView('generate');
    } else if (params.get('action') === 'log_meal') {
      setView('log');
    } else if (currentPlan) {
        setView('current');
    } else if (savedPlans.length > 0) {
        setCurrentPlan(savedPlans[0]);
        setView('current');
    } else {
        setView('generate');
    }
  // Fix: Added currentPlan and savedPlans to dependency array
  }, [location.search, currentPlan, savedPlans]);


  const handlePlanGenerated = (plan: NutritionPlan) => {
    setCurrentPlan(plan);
    setSavedPlans(prev => [plan, ...prev.filter(p => p.id !== plan.id)]);
    setView('current');
  };

  const handleSelectPlanFromHistory = (plan: NutritionPlan) => {
    setIsLoadingPlan(true);
    setTimeout(() => {
        setCurrentPlan(plan);
        setView('current');
        setIsLoadingPlan(false);
    }, 500);
  };

  const handleLogFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (foodName && foodCalories) {
        const newLogEntry = {
            id: Date.now().toString(),
            name: foodName,
            calories: parseInt(foodCalories),
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        };
        setFoodLog(prev => [newLogEntry, ...prev]);
        setFoodName('');
        setFoodCalories('');
        // Here you might also send this data to an AI for analysis or just store it.
        alert(`Refeição "${newLogEntry.name}" (${newLogEntry.calories} kcal) registrada! (Simulação)`);
    }
  };

  const renderContent = () => {
    if (isLoadingPlan) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
    }

    if (view === 'generate' || (view === 'current' && !currentPlan)) {
      return <NutritionPlanner currentPlan={null} onPlanGenerated={handlePlanGenerated} viewGenerator={() => setView('generate')} />;
    }
    if (view === 'current' && currentPlan) {
      return <NutritionPlanner currentPlan={currentPlan} onPlanGenerated={handlePlanGenerated} viewGenerator={() => setView('generate')} />;
    }
     if (view === 'log') {
        return (
            <Card>
                <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4">Registrar Consumo Alimentar</h3>
                <form onSubmit={handleLogFood} className="space-y-4 mb-6">
                    <Input label="Nome do Alimento/Refeição" value={foodName} onChange={e => setFoodName(e.target.value)} required />
                    <Input label="Calorias (kcal)" type="number" value={foodCalories} onChange={e => setFoodCalories(e.target.value)} required />
                    <Button type="submit" variant="secondary" leftIcon={PlusCircle}>Registrar Refeição</Button>
                </form>
                <h4 className="text-lg font-medium text-neutral-dark dark:text-white mb-3">Refeições Registradas Hoje:</h4>
                {foodLog.length > 0 ? (
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {foodLog.map(item => <FoodLogItem key={item.id} item={item} />)}
                    </ul>
                ) : (
                    <p className="text-neutral-DEFAULT dark:text-slate-300">Nenhuma refeição registrada ainda hoje.</p>
                )}
            </Card>
        );
    }
    if (view === 'history') {
      return (
        <Card>
          <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4">Histórico de Planos Nutricionais</h3>
          {savedPlans.length > 0 ? (
            <ul className="space-y-3">
              {savedPlans.map(plan => (
                <li key={plan.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium text-neutral-dark dark:text-white">{plan.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">~{plan.dailyCalorieTarget} kcal/dia</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary/10" onClick={() => handleSelectPlanFromHistory(plan)}>Carregar Plano</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-DEFAULT dark:text-slate-300">Você ainda não tem planos nutricionais salvos.</p>
          )}
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
        <Button 
            // Fix: Simplified condition for variant and className. Button is active if view is 'current' or 'generate'.
            variant={(view === 'current' || view === 'generate') ? 'secondary' : 'ghost'} 
            onClick={() => setView(currentPlan || savedPlans.length > 0 || view === 'generate' ? 'current' : 'generate')} // Ensure clicking goes to 'current' if a plan exists or stays/goes to 'generate'
            leftIcon={ListChecks}
            className={(view === 'current' || view === 'generate') ? "" : "text-secondary border-secondary hover:bg-secondary/10"}
        >
            Plano Nutricional
        </Button>
        <Button 
            variant={view === 'log' ? 'secondary' : 'ghost'} 
            onClick={() => setView('log')}
            leftIcon={BookOpen}
            className={view === 'log' ? "" : "text-secondary border-secondary hover:bg-secondary/10"}
        >
            Registrar Refeição
        </Button>
        <Button 
            variant={view === 'history' ? 'secondary' : 'ghost'} 
            onClick={() => setView('history')}
            // Fix: Replaced ClockRewind with History
            leftIcon={History}
            className={view === 'history' ? "" : "text-secondary border-secondary hover:bg-secondary/10"}
        >
            Histórico
        </Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default DashboardNutrition;
