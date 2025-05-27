
import React, { useState } from 'react';
import { WorkoutPlan, WorkoutDay, WorkoutExercise as WorkoutExerciseType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ChevronDown, PlayCircle, CheckCircle, CalendarDays, Info } from 'lucide-react';
import Modal from '../../ui/Modal';
import { MOCK_EXERCISES } from '../../../constants'; // For video URLs, if needed

interface WorkoutExerciseProps {
  exercise: WorkoutExerciseType;
  onShowVideo: (videoUrl: string, exerciseName: string) => void;
}

const WorkoutExercise: React.FC<WorkoutExerciseProps> = ({ exercise, onShowVideo }) => {
  const exerciseDetails = MOCK_EXERCISES.find(e => e.name.toLowerCase() === exercise.name.toLowerCase() || e.id === (exercise as any).exerciseId);
  const videoUrl = exercise.videoUrl || exerciseDetails?.videoUrl;

  return (
    <li className="py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-md transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="font-medium text-neutral-dark dark:text-white">{exercise.name}</h5>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {exercise.sets} séries x {exercise.reps} reps - Descanso: {exercise.rest}
          </p>
        </div>
        {videoUrl && videoUrl !== 'placeholder_url' && videoUrl !== '' && (
          <Button variant="ghost" size="icon" onClick={() => onShowVideo(videoUrl, exercise.name)} aria-label={`Ver vídeo de ${exercise.name}`}>
            <PlayCircle size={20} className="text-primary" />
          </Button>
        )}
      </div>
    </li>
  );
};

interface WorkoutDayCardProps {
  day: WorkoutDay;
  onShowVideo: (videoUrl: string, exerciseName: string) => void;
}

const WorkoutDayCard: React.FC<WorkoutDayCardProps> = ({ day, onShowVideo }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left py-2"
        aria-expanded={isOpen}
      >
        <div>
          <h4 className="text-lg font-semibold text-primary dark:text-primary-light">{day.day}</h4>
          <p className="text-sm text-neutral-DEFAULT dark:text-slate-300">{day.focus} {day.estimatedDurationMinutes ? `(${day.estimatedDurationMinutes} min)` : ''}</p>
        </div>
        <ChevronDown size={24} className={`text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-4 animate-fade-in">
          {day.exercises.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {day.exercises.map((ex, index) => (
                <WorkoutExercise key={index} exercise={ex} onShowVideo={onShowVideo} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum exercício para este dia.</p>
          )}
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="secondary" size="sm" leftIcon={PlayCircle} onClick={() => alert(`Simulação: Iniciar treino do ${day.day}`)}>Iniciar Treino</Button>
            <Button variant="outline" size="sm" leftIcon={CheckCircle} onClick={() => alert(`Simulação: Marcar ${day.day} como concluído`)}>Concluir Treino</Button>
          </div>
        </div>
      )}
    </Card>
  );
};


interface WorkoutDisplayProps {
  plan: WorkoutPlan;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ plan }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentExerciseName, setCurrentExerciseName] = useState('');

  const handleShowVideo = (videoUrl: string, exerciseName: string) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentExerciseName(exerciseName);
    setIsVideoModalOpen(true);
  };

  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-to-br from-primary-light/10 to-sky-500/10 dark:from-primary-dark/20 dark:to-sky-800/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-dark dark:text-white">{plan.name}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
              Nível: {plan.fitnessLevel} | Objetivos: {plan.goals.join(', ')}
            </p>
            {plan.description && <p className="text-sm text-slate-500 dark:text-slate-400 italic">{plan.description}</p>}
          </div>
          <Button variant="primary" size="sm" leftIcon={CalendarDays} className="mt-3 sm:mt-0" onClick={() => alert("Simulação: Adicionar plano ao calendário")}>
            Adicionar ao Calendário
          </Button>
        </div>
        
        {plan.days && plan.days.length > 0 ? (
          plan.days.map((day, index) => (
            <WorkoutDayCard key={index} day={day} onShowVideo={handleShowVideo} />
          ))
        ) : (
            <Card className="text-center p-6">
                <Info size={32} className="mx-auto text-primary mb-2" />
                <p className="text-neutral-dark dark:text-white">Nenhum dia de treino encontrado para este plano.</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tente gerar um novo plano com diferentes parâmetros.</p>
            </Card>
        )}
      </Card>

      <Modal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} title={`Vídeo: ${currentExerciseName}`} size="lg">
        {currentVideoUrl.startsWith('https://picsum.photos') ? (
            <img src={currentVideoUrl} alt={`Demonstração de ${currentExerciseName}`} className="w-full rounded aspect-video object-cover" />
        ) : (
            <iframe 
                className="w-full aspect-video rounded"
                src={currentVideoUrl.includes("youtube.com/embed") ? currentVideoUrl : `https://www.youtube.com/embed/${currentVideoUrl}`} // Basic handling for YouTube links
                title={`Vídeo de ${currentExerciseName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
        )}
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Este é um vídeo de demonstração. Consulte um profissional para a execução correta.</p>
      </Modal>
    </div>
  );
};

export default WorkoutDisplay;
    