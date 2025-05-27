
import React, { useState, useContext, useEffect, ChangeEvent } from 'react';
import { AuthContext, AuthContextType } from '../../../contexts/AuthContext';
import { User as UserType, FitnessLevel, SubscriptionTier } from '../../../types';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
// Fix: Alias Lock to LockIcon to prevent potential naming conflicts with global types (e.g., Web Locks API)
import { User, Mail, Shield, Zap, Activity, Dumbbell, Clock, Save, Image as ImageIcon, Lock as LockIcon } from 'lucide-react';
import { MOCK_EXERCISES, DEFAULT_USER_FITNESS_LEVEL, DEFAULT_USER_GOALS, DEFAULT_USER_EQUIPMENT, DEFAULT_USER_TIME_PER_SESSION, PRICING_PLANS } from '../../../constants';
import { useToasts, ToastType } from '../../ui/Toast'; // Assuming useToasts is available globally or through App.tsx setup

const commonGoalsList = ['Perder peso', 'Ganhar massa muscular', 'Melhorar condicionamento', 'Aumentar força', 'Mais flexibilidade', 'Reduzir estresse'];
const commonEquipmentList = ['Halteres', 'Barra', 'Anilhas', 'Kettlebell', 'Elásticos de resistência', 'Corda de pular', 'Esteira', 'Bicicleta Ergométrica', 'Bola de Pilates', 'Nenhum (Peso Corporal)'];


const DashboardProfilePage: React.FC = () => {
  const { user, updateUserPlan, login, isLoading: authLoading } = useContext(AuthContext) as AuthContextType;
  const { addToast } = useToasts();

  const [formData, setFormData] = useState<Partial<UserType>>({
    name: '',
    email: '', // Email typically not changeable or requires verification
    avatarUrl: '',
    fitnessLevel: DEFAULT_USER_FITNESS_LEVEL,
    goals: [...DEFAULT_USER_GOALS],
    availableEquipment: [...DEFAULT_USER_EQUIPMENT],
    timePerSession: DEFAULT_USER_TIME_PER_SESSION,
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
        fitnessLevel: user.fitnessLevel || DEFAULT_USER_FITNESS_LEVEL,
        goals: user.goals && user.goals.length > 0 ? [...user.goals] : [...DEFAULT_USER_GOALS],
        availableEquipment: user.availableEquipment && user.availableEquipment.length > 0 ? [...user.availableEquipment] : [...DEFAULT_USER_EQUIPMENT],
        timePerSession: user.timePerSession || DEFAULT_USER_TIME_PER_SESSION,
        plan: user.plan || SubscriptionTier.None, // Keep track of current plan
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'timePerSession' ? parseInt(value) : value }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => {
      const currentGoals = prev.goals || [];
      return {
        ...prev,
        goals: currentGoals.includes(goal) ? currentGoals.filter(g => g !== goal) : [...currentGoals, goal]
      };
    });
  };
  
  const handleEquipmentToggle = (equipment: string) => {
    setFormData(prev => {
      const currentEquipment = prev.availableEquipment || [];
      return {
        ...prev,
        availableEquipment: currentEquipment.includes(equipment) ? currentEquipment.filter(eq => eq !== equipment) : [...currentEquipment, equipment]
      };
    });
  };


  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    // Simulate API call to update profile
    try {
      // In a real app, you'd send formData to your backend.
      // Here, we update the AuthContext directly.
      // The AuthContext's login function is abused here to update the user.
      // A dedicated updateUser function in AuthContext would be better.
      const updatedUserData: UserType = {
        ...user,
        name: formData.name || user.name,
        avatarUrl: formData.avatarUrl || user.avatarUrl,
        fitnessLevel: formData.fitnessLevel || user.fitnessLevel,
        goals: formData.goals || user.goals,
        availableEquipment: formData.availableEquipment || user.availableEquipment,
        timePerSession: formData.timePerSession || user.timePerSession,
      };
      
      // Simulate updating user by "re-logging in" with new data
      // This is a hack for this simulation. A proper updateUser function is needed in AuthContext.
      await login({ name: updatedUserData.name, email: updatedUserData.email, avatarUrl: updatedUserData.avatarUrl, fitnessLevel: updatedUserData.fitnessLevel, goals: updatedUserData.goals, availableEquipment: updatedUserData.availableEquipment, timePerSession: updatedUserData.timePerSession });
      
      addToast('Perfil atualizado com sucesso!', ToastType.Success);
    } catch (error) {
      addToast('Erro ao atualizar perfil. Tente novamente.', ToastType.Error);
      console.error("Profile update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      addToast('As novas senhas não coincidem!', ToastType.Error);
      return;
    }
    if (newPassword.length < 6) {
      addToast('A nova senha deve ter pelo menos 6 caracteres.', ToastType.Error);
      return;
    }
    setIsSaving(true);
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 1000));
    addToast('Senha alterada com sucesso! (Simulação)', ToastType.Success);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsSaving(false);
  };

  if (authLoading && !user) {
    return <div className="flex justify-center items-center h-64"><p>Carregando perfil...</p></div>;
  }
  if (!user) {
    return <p className="text-center text-red-500">Usuário não encontrado. Por favor, faça login novamente.</p>;
  }

  const fitnessLevelOptions = Object.values(FitnessLevel).map(level => ({ value: level, label: level }));
  const currentPlanDetails = PRICING_PLANS.find(p => p.id === user.plan);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-neutral-dark dark:text-white">Meu Perfil</h2>

      {/* Informações Pessoais */}
      <Card>
        <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-6 flex items-center">
          <User size={22} className="mr-2 text-primary" /> Informações Pessoais
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fix: Input icon prop expects React.ReactNode, so <User .../> is correct. */}
            <Input label="Nome Completo" name="name" value={formData.name || ''} onChange={handleChange} icon={<User size={18} className="text-slate-400"/>} />
            <Input label="Email" name="email" type="email" value={formData.email || ''} icon={<Mail size={18} className="text-slate-400"/>} disabled title="Email não pode ser alterado (simulação)" />
          </div>
          <Input label="URL da Imagem de Avatar" name="avatarUrl" value={formData.avatarUrl || ''} onChange={handleChange} icon={<ImageIcon size={18} className="text-slate-400"/>} placeholder="https://exemplo.com/avatar.png"/>
          
          <div className="text-right">
            {/* Fix: Button's leftIcon prop expects LucideIcon (component type), not an element. */}
            <Button type="submit" isLoading={isSaving} leftIcon={Save}>
              Salvar Informações
            </Button>
          </div>
        </form>
      </Card>

      {/* Preferências de Fitness */}
      <Card>
        <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-6 flex items-center">
          <Zap size={22} className="mr-2 text-primary" /> Preferências de Fitness
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-6"> {/* Can also be part of the main form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fix: Removed non-existent 'icon' prop from Select component. */}
            <Select label="Nível de Condicionamento" name="fitnessLevel" options={fitnessLevelOptions} value={formData.fitnessLevel || ''} onChange={handleChange} />
            <Input label="Tempo por Sessão (minutos)" name="timePerSession" type="number" value={formData.timePerSession || ''} onChange={handleChange} min="10" step="5" icon={<Clock size={18} className="text-slate-400"/>}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">Objetivos Principais</label>
            <div className="flex flex-wrap gap-2">
              {commonGoalsList.map(goal => (
                <Button key={goal} type="button" variant={(formData.goals || []).includes(goal) ? 'primary' : 'outline'} size="sm" onClick={() => handleGoalToggle(goal)}>
                  {goal}
                </Button>
              ))}
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">Equipamentos Disponíveis</label>
            <div className="flex flex-wrap gap-2">
              {commonEquipmentList.map(eq => (
                <Button key={eq} type="button" variant={(formData.availableEquipment || []).includes(eq) ? 'secondary' : 'outline'} size="sm" onClick={() => handleEquipmentToggle(eq)}
                  className={(formData.availableEquipment || []).includes(eq) ? "" : "border-secondary text-secondary hover:bg-secondary/10"}>
                  {eq}
                </Button>
              ))}
            </div>
          </div>
          <div className="text-right">
            {/* Fix: Button's leftIcon prop expects LucideIcon (component type), not an element. */}
            <Button type="submit" isLoading={isSaving} leftIcon={Save}>
              Salvar Preferências de Fitness
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Gerenciamento de Senha */}
      <Card>
        <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-6 flex items-center">
          <Shield size={22} className="mr-2 text-primary" /> Alterar Senha
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          {/* Fix: Use aliased LockIcon for Input component's icon prop. */}
          <Input label="Senha Atual" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} icon={<LockIcon size={18} className="text-slate-400"/>} required />
          <Input label="Nova Senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} icon={<LockIcon size={18} className="text-slate-400"/>} required />
          <Input label="Confirmar Nova Senha" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} icon={<LockIcon size={18} className="text-slate-400"/>} required />
          <div className="text-right">
            {/* Fix: Button's leftIcon prop expects LucideIcon (component type), not an element. */}
            <Button type="submit" isLoading={isSaving} variant="outline" leftIcon={Save}>
              Alterar Senha
            </Button>
          </div>
        </form>
      </Card>

      {/* Detalhes da Assinatura */}
      <Card>
        <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4 flex items-center">
          <Dumbbell size={22} className="mr-2 text-primary" /> Minha Assinatura
        </h3>
        {currentPlanDetails ? (
          <>
            <p className="text-lg">Seu plano atual: <span className="font-bold text-primary dark:text-primary-light">{currentPlanDetails.name}</span> (R${currentPlanDetails.pricePerMonth}/mês)</p>
            <p className="text-sm text-neutral-DEFAULT dark:text-slate-300 mb-4">Agradecemos por fazer parte da comunidade FitLife!</p>
            <Button variant="outline" onClick={() => alert("Simulação: Redirecionando para gerenciamento de assinatura.")}>Gerenciar Assinatura</Button>
          </>
        ) : (
          <>
            <p className="text-lg text-neutral-DEFAULT dark:text-slate-300">Você não possui uma assinatura ativa.</p>
            <Button variant="primary" onClick={() => {/* navigate to plans */}}>Ver Planos</Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default DashboardProfilePage;
