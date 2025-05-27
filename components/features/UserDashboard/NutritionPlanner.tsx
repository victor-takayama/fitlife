
import React, { useState, useContext } from 'react';
import { NutritionPlan, DailyMealPlan, Meal } from '../../../types';
import { generateNutritionPlan } from '../../../services/geminiService';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { AuthContext, AuthContextType } from '../../../contexts/AuthContext';
import { Apple, UtensilsCrossed, ChevronDown, Info, Beef, Salad, Fish } from 'lucide-react';
import LoadingSpinner from '../../ui/LoadingSpinner';

const MealDisplay: React.FC<{ mealName: string; meal: Meal | undefined }> = ({ mealName, meal }) => {
    if (!meal) return null;
    return (
        <div className="mb-2 p-2 bg-slate-100 dark:bg-slate-700/50 rounded">
            <h6 className="font-semibold text-sm text-neutral-dark dark:text-white">{mealName}: {meal.name}</h6>
            <p className="text-xs text-slate-500 dark:text-slate-400">{meal.description}</p>
            {(meal.calories || meal.protein) && (
                <p className="text-xs text-primary dark:text-primary-light mt-1">
                    {meal.calories && `Cal: ${meal.calories} `}
                    {meal.protein && `P: ${meal.protein}g `}
                    {meal.carbs && `C: ${meal.carbs}g `}
                    {meal.fats && `G: ${meal.fats}g`}
                </p>
            )}
        </div>
    );
}


const DailyMealPlanCard: React.FC<{ dailyPlan: DailyMealPlan }> = ({ dailyPlan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mealIcons = {
    breakfast: <Beef size={16} className="mr-2 text-amber-500" />,
    snack1: <Apple size={16} className="mr-2 text-green-500" />,
    lunch: <Salad size={16} className="mr-2 text-lime-500" />,
    snack2: <Apple size={16} className="mr-2 text-green-500" />,
    dinner: <Fish size={16} className="mr-2 text-sky-500" />,
  };

  return (
    <Card className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left py-1"
        aria-expanded={isOpen}
      >
        <h5 className="text-md font-semibold text-secondary dark:text-secondary-light">{dailyPlan.day}</h5>
        <ChevronDown size={20} className={`text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 animate-fade-in space-y-2">
          <MealDisplay mealName="Café da Manhã" meal={dailyPlan.meals.breakfast} />
          <MealDisplay mealName="Lanche 1" meal={dailyPlan.meals.snack1} />
          <MealDisplay mealName="Almoço" meal={dailyPlan.meals.lunch} />
          <MealDisplay mealName="Lanche 2" meal={dailyPlan.meals.snack2} />
          <MealDisplay mealName="Jantar" meal={dailyPlan.meals.dinner} />
          {dailyPlan.totalCalories && <p className="text-sm font-medium text-right mt-2 text-neutral-dark dark:text-white">Total: ~{dailyPlan.totalCalories} kcal</p>}
        </div>
      )}
    </Card>
  );
};

interface NutritionPlannerProps {
  currentPlan: NutritionPlan | null;
  onPlanGenerated: (plan: NutritionPlan) => void;
  viewGenerator: () => void; // To switch view to generator
}

const NutritionPlanner: React.FC<NutritionPlannerProps> = ({ currentPlan, onPlanGenerated, viewGenerator }) => {
  // Form state is separate from the main display
  const { user } = useContext(AuthContext) as AuthContextType;
  const [goal, setGoal] = useState<string>(user?.goals?.[0] || 'Perda de Peso');
  const [dailyCalories, setDailyCalories] = useState<number>(2000);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [customRestriction, setCustomRestriction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goalOptions = [
    { value: 'Perda de Peso', label: 'Perda de Peso' },
    { value: 'Ganho de Massa Muscular', label: 'Ganho de Massa Muscular' },
    { value: 'Manutenção Saudável', label: 'Manutenção Saudável' },
    { value: 'Melhorar Performance', label: 'Melhorar Performance' },
  ];
  const commonRestrictions = ['Sem Glúten', 'Sem Lactose', 'Vegetariano', 'Vegano', 'Baixo Carboidrato'];

  const handleRestrictionToggle = (restriction: string) => {
    setDietaryRestrictions(prev => prev.includes(restriction) ? prev.filter(r => r !== restriction) : [...prev, restriction]);
  }
  const handleAddCustomRestriction = () => {
    if (customRestriction && !dietaryRestrictions.includes(customRestriction)) {
        setDietaryRestrictions(prev => [...prev, customRestriction]);
    }
    setCustomRestriction('');
  }

  const handleSubmitGenerator = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateNutritionPlan(goal, dailyCalories, dietaryRestrictions);
      if (plan) {
        onPlanGenerated(plan);
      } else {
        setError("Não foi possível gerar o plano nutricional. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };


  if (!currentPlan) {
    return (
      <Card className="max-w-xl mx-auto">
        <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-6 flex items-center">
            <UtensilsCrossed size={22} className="mr-2 text-secondary" /> Gerador de Plano Nutricional IA
        </h3>
        <form onSubmit={handleSubmitGenerator} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Objetivo Principal</label>
            <Select id="goal" options={goalOptions} value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <div>
            <label htmlFor="dailyCalories" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Meta Calórica Diária (kcal)</label>
            <Input id="dailyCalories" type="number" value={dailyCalories} onChange={(e) => setDailyCalories(parseInt(e.target.value))} min="1000" step="50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Restrições Alimentares (opcional)</label>
             <div className="flex flex-wrap gap-2 mb-2">
                {commonRestrictions.map(res => (
                <Button 
                    key={res}
                    type="button"
                    variant={dietaryRestrictions.includes(res) ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleRestrictionToggle(res)}
                    className={dietaryRestrictions.includes(res) ? "" : "border-secondary text-secondary hover:bg-secondary/10"}
                >
                    {res}
                </Button>
                ))}
            </div>
            <div className="flex gap-2 items-center">
                <Input 
                    type="text" 
                    placeholder="Outra restrição..." 
                    value={customRestriction}
                    onChange={(e) => setCustomRestriction(e.target.value)}
                    className="flex-grow"
                />
                <Button type="button" onClick={handleAddCustomRestriction} variant="ghost" size="sm">Adicionar</Button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" variant="secondary" size="lg" className="w-full" isLoading={isLoading}>
            Gerar Plano Nutricional
          </Button>
        </form>
      </Card>
    );
  }

  // Display current plan
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-to-br from-secondary-light/10 to-emerald-500/10 dark:from-secondary-dark/20 dark:to-emerald-800/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold text-neutral-dark dark:text-white">{currentPlan.name}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                Meta: ~{currentPlan.dailyCalorieTarget} kcal/dia
                </p>
                {currentPlan.description && <p className="text-sm text-slate-500 dark:text-slate-400 italic">{currentPlan.description}</p>}
            </div>
            <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary/10 mt-3 sm:mt-0" onClick={viewGenerator}>
                Gerar Novo Plano
            </Button>
        </div>
        
        {currentPlan.days && currentPlan.days.length > 0 ? (
          currentPlan.days.map((dayPlan, index) => (
            <DailyMealPlanCard key={index} dailyPlan={dayPlan} />
          ))
        ) : (
            <Card className="text-center p-6">
                <Info size={32} className="mx-auto text-secondary mb-2" />
                <p className="text-neutral-dark dark:text-white">Nenhum dia de refeição encontrado para este plano.</p>
            </Card>
        )}
      </Card>
    </div>
  );
};

export default NutritionPlanner;
    