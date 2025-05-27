

import React, { useState, useEffect, useContext } from 'react';
import { ProgressDataPoint, ProgressMetric, BodyScanMetrics, Gender, ActivityLevel } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Scale, Activity, Percent, PlusCircle, FileText } from 'lucide-react';
import { AuthContext, AuthContextType } from '../../../contexts/AuthContext';
import { analyzeBodyScanData } from '../../../services/geminiService';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Modal from '../../ui/Modal';

// Mock data - in a real app, this would come from user input or API
const initialProgressMetrics: ProgressMetric[] = [
  { name: 'Peso Corporal', unit: 'kg', data: [{ date: '2024-07-01', value: 80 }, { date: '2024-07-08', value: 79.5 }, { date: '2024-07-15', value: 79 }, { date: '2024-07-22', value: 78.5 }] },
  { name: 'Duração do Treino', unit: 'min', data: [{ date: '2024-07-01', value: 30 }, { date: '2024-07-08', value: 35 }, { date: '2024-07-15', value: 40 }, { date: '2024-07-22', value: 45 }] },
  { name: 'Flexões Máximas', unit: 'reps', data: [{ date: '2024-07-01', value: 10 }, { date: '2024-07-08', value: 12 }, { date: '2024-07-15', value: 15 }, { date: '2024-07-22', value: 18 }] },
];

const initialBodyScans: BodyScanMetrics[] = [
    { date: '2024-07-01', weightKg: 80, bodyFatPercentage: 25, muscleMassKg: 30, bmi: 27.6, age: 30, gender: 'male', activityLevel: 'moderate' },
    { date: '2024-07-22', weightKg: 78.5, bodyFatPercentage: 23.5, muscleMassKg: 30.5, bmi: 27.1, age: 30, gender: 'male', activityLevel: 'active' },
];

const genderOptions: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Feminino' },
    { value: 'other', label: 'Outro' },
];

const activityLevelOptions: { value: ActivityLevel; label: string }[] = [
    { value: 'sedentary', label: 'Sedentário (pouco ou nenhum exercício)' },
    { value: 'light', label: 'Leve (exercício leve 1-3 dias/semana)' },
    { value: 'moderate', label: 'Moderado (exercício moderado 3-5 dias/semana)' },
    { value: 'active', label: 'Ativo (exercício intenso 6-7 dias/semana)' },
    { value: 'very_active', label: 'Muito Ativo (exercício muito intenso e trabalho físico)' },
];


const DashboardProgress: React.FC = () => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [metrics, setMetrics] = useState<ProgressMetric[]>(initialProgressMetrics);
  const [bodyScans, setBodyScans] = useState<BodyScanMetrics[]>(initialBodyScans);
  const [selectedMetric, setSelectedMetric] = useState<ProgressMetric>(metrics[0]);
  
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logValue, setLogValue] = useState('');
  const [metricToLog, setMetricToLog] = useState<ProgressMetric | null>(null);

  const [isBodyScanModalOpen, setIsBodyScanModalOpen] = useState(false);
  const [bodyScanInput, setBodyScanInput] = useState<Partial<BodyScanMetrics>>({date: new Date().toISOString().split('T')[0]});
  const [bodyScanAnalysis, setBodyScanAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // In a real app, fetch metrics for the user
    // Pre-fill some body scan info from user if available (example, not implemented in User type yet)
    // setBodyScanInput(prev => ({ ...prev, age: user?.age, gender: user?.gender }));
  }, [user]);

  const handleLogMetric = (metric: ProgressMetric) => {
    setMetricToLog(metric);
    setLogValue(''); // Reset value
    setIsLogModalOpen(true);
  };

  const submitLog = () => {
    if (metricToLog && logValue) {
      const newPoint: ProgressDataPoint = { date: logDate, value: parseFloat(logValue) };
      const updatedMetrics = metrics.map(m => 
        m.name === metricToLog.name 
        ? { ...m, data: [...m.data, newPoint].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) } 
        : m
      );
      setMetrics(updatedMetrics);
      setSelectedMetric(updatedMetrics.find(m => m.name === metricToLog.name) || updatedMetrics[0]);
      setIsLogModalOpen(false);
    }
  };

  const handleBodyScanInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "age" || name === "weightKg" || name === "heightCm" || name === "bodyFatPercentage" || name === "muscleMassKg") {
      setBodyScanInput(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
    } else {
      setBodyScanInput(prev => ({ ...prev, [name]: value as any })); // For string fields like date, gender, activityLevel
    }
  };

  const submitBodyScan = async () => {
    if (!bodyScanInput.date) return; // Date is mandatory
    
    const newScan: BodyScanMetrics = {
        date: bodyScanInput.date,
        weightKg: bodyScanInput.weightKg,
        heightCm: bodyScanInput.heightCm,
        bodyFatPercentage: bodyScanInput.bodyFatPercentage,
        muscleMassKg: bodyScanInput.muscleMassKg,
        age: bodyScanInput.age,
        gender: bodyScanInput.gender,
        activityLevel: bodyScanInput.activityLevel,
        // BMI could be calculated here if weight and height are present and stored
    };
    setBodyScans(prev => [...prev, newScan].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    
    setIsAnalyzing(true);
    setBodyScanAnalysis(null);
    const analysis = await analyzeBodyScanData({
        weightKg: newScan.weightKg, 
        heightCm: newScan.heightCm, 
        age: newScan.age,
        gender: newScan.gender,
        activityLevel: newScan.activityLevel
    });
    setBodyScanAnalysis(analysis);
    setIsAnalyzing(false);
    // Keep modal open to show analysis by default
    // setIsBodyScanModalOpen(false); 
  };


  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-semibold text-neutral-dark dark:text-white mb-2 sm:mb-0">
            Seu Progresso
          </h2>
          <div className="flex space-x-2">
            <Button onClick={() => setIsBodyScanModalOpen(true)} leftIcon={FileText} variant="outline">Simular Body Scan</Button>
            {/* <Button onClick={() => alert("Adicionar métrica customizada (simulação)")} leftIcon={PlusCircle}>Adicionar Métrica</Button> */}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {metrics.map(metric => (
            <Card 
              key={metric.name} 
              className={`cursor-pointer transition-all ${selectedMetric.name === metric.name ? 'ring-2 ring-primary dark:ring-primary-light' : 'hover:shadow-md'}`}
              onClick={() => setSelectedMetric(metric)}
            >
              <h3 className="text-lg font-medium text-neutral-dark dark:text-white">{metric.name}</h3>
              <p className="text-2xl font-bold text-primary dark:text-primary-light">
                {metric.data.length > 0 ? metric.data[metric.data.length - 1].value : '-'} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{metric.unit}</span>
              </p>
              <Button size="sm" variant="ghost" className="mt-2 text-xs" onClick={(e) => { e.stopPropagation(); handleLogMetric(metric); }}>Registrar Novo</Button>
            </Card>
          ))}
        </div>
        
        <Card>
          <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-1">{selectedMetric.name} ao Longo do Tempo</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Unidade: {selectedMetric.unit}</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedMetric.data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('pt-BR', {month:'short', day:'numeric'})} tick={{ fill: 'rgb(100 116 139 / var(--tw-text-opacity))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'rgb(100 116 139 / var(--tw-text-opacity))', fontSize: 12 }} />
                <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                    formatter={(value) => [`${value} ${selectedMetric.unit}`, selectedMetric.name]}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', borderRadius: '0.5rem' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="value" name={selectedMetric.name} strokeWidth={2} stroke="#06b6d4" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-neutral-dark dark:text-white mb-4">
            Análise Corporal (Simulada)
        </h2>
        <Card>
             <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4">Histórico de Body Scans</h3>
             {bodyScans.length > 0 ? (
                <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bodyScans} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('pt-BR', {month:'short', day:'numeric'})} tick={{ fill: 'rgb(100 116 139 / var(--tw-text-opacity))', fontSize: 12 }}/>
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fill: '#8884d8', fontSize: 12 }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fill: '#82ca9d', fontSize: 12 }}/>
                            <Tooltip 
                                labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', borderRadius: '0.5rem' }}/>
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Bar yAxisId="left" dataKey="weightKg" name="Peso (kg)" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="bodyFatPercentage" name="% Gordura Corporal" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="left" dataKey="muscleMassKg" name="Massa Muscular (kg)" fill="#ffc658" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             ) : (
                <p className="text-neutral-DEFAULT dark:text-slate-300">Nenhum body scan registrado.</p>
             )}
             {bodyScans.length > 0 && (bodyScanAnalysis || isAnalyzing) && (
                 <Card className="mt-4 bg-primary-light/10 dark:bg-primary-dark/20">
                     <h4 className="text-lg font-semibold text-primary dark:text-primary-light mb-2">Análise IA do Último Scan:</h4>
                     {isAnalyzing ? <LoadingSpinner /> : <p className="text-neutral-dark dark:text-white whitespace-pre-line">{bodyScanAnalysis}</p>}
                 </Card>
             )}
        </Card>
      </section>

      {/* Modal for logging metric */}
      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title={`Registrar ${metricToLog?.name}`}>
        <div className="space-y-4">
          <Input 
            label="Data" 
            type="date" 
            value={logDate} 
            onChange={(e) => setLogDate(e.target.value)} 
          />
          <Input 
            label={`Valor (${metricToLog?.unit})`}
            type="number" 
            value={logValue} 
            onChange={(e) => setLogValue(e.target.value)} 
            placeholder={`Novo valor para ${metricToLog?.name}`}
            required
            step="any"
          />
          <Button onClick={submitLog} className="w-full">Salvar Registro</Button>
        </div>
      </Modal>

      {/* Modal for Body Scan */}
      <Modal isOpen={isBodyScanModalOpen} onClose={() => setIsBodyScanModalOpen(false)} title="Simulador de Body Scan IA" size="lg">
        <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Insira seus dados mais recentes. A IA fornecerá uma análise (simulada).</p>
            <Input label="Data do Scan" type="date" name="date" value={bodyScanInput.date || ''} onChange={handleBodyScanInputChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Peso (kg)" type="number" name="weightKg" value={bodyScanInput.weightKg || ''} onChange={handleBodyScanInputChange} step="any" />
                <Input label="Altura (cm)" type="number" name="heightCm" value={bodyScanInput.heightCm || ''} onChange={handleBodyScanInputChange} placeholder="Ex: 175" step="any"/>
                <Input label="% Gordura Corporal" type="number" name="bodyFatPercentage" value={bodyScanInput.bodyFatPercentage || ''} onChange={handleBodyScanInputChange} step="any"/>
                <Input label="Massa Muscular (kg)" type="number" name="muscleMassKg" value={bodyScanInput.muscleMassKg || ''} onChange={handleBodyScanInputChange} step="any"/>
                <Input label="Idade (anos)" type="number" name="age" value={bodyScanInput.age || ''} onChange={handleBodyScanInputChange} />
                {/* Fix: The 'placeholder' prop is now valid for Select component after fixing Select.tsx */}
                <Select label="Gênero" name="gender" options={genderOptions} value={bodyScanInput.gender || ''} onChange={handleBodyScanInputChange} placeholder="Selecione o gênero"/>
            </div>
            {/* Fix: The 'placeholder' prop is now valid for Select component after fixing Select.tsx */}
            <Select label="Nível de Atividade Física" name="activityLevel" options={activityLevelOptions} value={bodyScanInput.activityLevel || ''} onChange={handleBodyScanInputChange} placeholder="Selecione o nível de atividade"/>
            
            {isAnalyzing && <div className="py-4"><LoadingSpinner /></div>}
            {bodyScanAnalysis && !isAnalyzing && (
                 <Card className="mt-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">
                     <h4 className="text-md font-semibold text-green-700 dark:text-green-300 mb-2">Análise da IA:</h4>
                     <p className="text-sm text-neutral-dark dark:text-neutral-light whitespace-pre-line">{bodyScanAnalysis}</p>
                 </Card>
            )}
            <Button onClick={submitBodyScan} className="w-full" isLoading={isAnalyzing} disabled={isAnalyzing}>
                {isAnalyzing ? 'Analisando...' : 'Salvar Scan e Analisar com IA'}
            </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardProgress;