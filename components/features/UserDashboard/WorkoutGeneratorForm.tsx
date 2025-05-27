
import React, { useState, useContext } from 'react';
import { FitnessLevel, WorkoutPlan, Exercise } from '../../../types';
import { generateWorkoutPlan } from '../../../services/geminiService';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { MOCK_EXERCISES, DEFAULT_USER_FITNESS_LEVEL, DEFAULT_USER_GOALS, DEFAULT_USER_EQUIPMENT, DEFAULT_USER_TIME_PER_SESSION } from '../../../constants';
import { AuthContext, AuthContextType } from '../../../contexts/AuthContext';
import { SlidersHorizontal } from 'lucide-react';

interface WorkoutGeneratorFormProps {
  onPlanGenerated: (plan: WorkoutPlan) => void;
  exerciseLibrary?: Exercise[]; // Optional: pass full library if needed for richer context for Gemini
}

const WorkoutGeneratorForm: React.FC<WorkoutGeneratorFormProps> = ({ onPlanGenerated, exerciseLibrary = MOCK_EXERCISES }) => {
  const { user } = useContext(AuthContext) as AuthContextType;

  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(user?.fitnessLevel || DEFAULT_USER_FITNESS_LEVEL);
  const [goals, setGoals] = useState<string[]> (user?.goals || DEFAULT_USER_GOALS);
  const [timePerSession, setTimePerSession] = useState<number>(user?.timePerSession || DEFAULT_USER_TIME_PER_SESSION);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [availableEquipment, setAvailableEquipment] = useState<string[]>(user?.availableEquipment || DEFAULT_USER_EQUIPMENT);
  const [customEquipment, setCustomEquipment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fitnessLevelOptions = Object.values(FitnessLevel).map(level => ({ value: level, label: level }));
  const daysOptions = [1,2,3,4,5,6,7].map(d => ({ value: d, label: `${d} dia${d > 1 ? 's' : ''}`}));
  
  // Common goals, user can add more
  const commonGoals = ['Perder peso', 'Ganhar massa muscular', 'Melhorar condicionamento', 'Aumentar força', 'Mais flexibilidade', 'Reduzir estresse'];
  const commonEquipment = ['Halteres', 'Barra', 'Anilhas', 'Kettlebell', 'Elásticos de resistência', 'Corda de pular', 'Esteira', 'Bicicleta Ergométrica', 'Bola de Pilates'];


  const handleGoalToggle = (goal: string) => {
    setGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  }

  const handleEquipmentToggle = (equip: string) => {
    setAvailableEquipment(prev => prev.includes(equip) ? prev.filter(e => e !== equip) : [...prev, equip]);
  }
  
  const handleAddCustomEquipment = () => {
    if (customEquipment && !availableEquipment.includes(customEquipment)) {
      setAvailableEquipment(prev => [...prev, customEquipment]);
    }
    setCustomEquipment('');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (goals.length === 0) {
        setError("Por favor, selecione ao menos um objetivo.");
        setIsLoading(false);
        return;
    }

    try {
      const plan = await generateWorkoutPlan(fitnessLevel, goals, timePerSession, daysPerWeek, availableEquipment, exerciseLibrary);
      if (plan) {
        onPlanGenerated(plan);
      } else {
        setError("Não foi possível gerar o plano de treino. Verifique sua conexão ou tente novamente mais tarde.");
      }
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro inesperado ao gerar o plano.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-6 flex items-center">
        <SlidersHorizontal size={22} className="mr-2 text-primary" /> Gerador de Treino Personalizado por IA
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Seu Nível de Condicionamento</label>
          <Select
            id="fitnessLevel"
            options={fitnessLevelOptions}
            value={fitnessLevel}
            onChange={(e) => setFitnessLevel(e.target.value as FitnessLevel)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Seus Objetivos Principais (selecione quantos quiser)</label>
          <div className="flex flex-wrap gap-2">
            {commonGoals.map(goal => (
              <Button 
                key={goal}
                type="button"
                variant={goals.includes(goal) ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleGoalToggle(goal)}
              >
                {goal}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="timePerSession" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Tempo por Sessão (minutos)</label>
                <Input
                    id="timePerSession"
                    type="number"
                    value={timePerSession}
                    onChange={(e) => setTimePerSession(Math.max(10, parseInt(e.target.value)))} // Min 10 minutes
                    min="10"
                    step="5"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Dias por Semana</label>
                <Select
                    id="daysPerWeek"
                    options={daysOptions}
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                />
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Equipamentos Disponíveis (selecione ou adicione)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {commonEquipment.map(equip => (
              <Button 
                key={equip}
                type="button"
                variant={availableEquipment.includes(equip) ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => handleEquipmentToggle(equip)}
                className={availableEquipment.includes(equip) ? "" : "border-secondary text-secondary hover:bg-secondary/10"}
              >
                {equip}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <Input 
                type="text" 
                placeholder="Outro equipamento..." 
                value={customEquipment}
                onChange={(e) => setCustomEquipment(e.target.value)}
                className="flex-grow"
            />
            <Button type="button" onClick={handleAddCustomEquipment} variant="ghost" size="sm">Adicionar</Button>
          </div>
           {availableEquipment.length === 0 && <p className="text-xs text-slate-500 mt-1">Nenhum equipamento selecionado (será gerado treino com peso corporal).</p>}
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
          Gerar Plano de Treino com IA
        </Button>
      </form>
    </Card>
  );
};

export default WorkoutGeneratorForm;

    