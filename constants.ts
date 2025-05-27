

import { Dumbbell, Utensils, Users, Info, MessageCircleQuestion, LayoutDashboard, BarChart3, Zap, ShieldCheck, LogIn, UserPlus, Sun, Moon, BrainCircuit, Activity, Flame, Apple, Users2, Gift, HelpCircle, Target, Bot, TrendingUp, UserCircle2, Handshake } from 'lucide-react';
// Fix: Changed MessageSquareQuestion to MessageCircleQuestion, removed ZapSquare. Added UserCircle2 for Profile, Handshake for Affiliate.
import { NavItem, PricingPlan, SubscriptionTier, ValueProposition, FaqItem, Exercise, FitnessLevel, Testimonial, CommunityChallenge } from './types';
// Fix: Added CommunityChallenge to import

export const APP_NAME = "FitLife";
export const API_KEY_ENV_VAR = "API_KEY"; 

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";

export const ROUTES = {
  HOME: "/",
  PLANS: "/plans",
  ABOUT: "/about",
  COMMUNITY: "/community",
  FAQ: "/faq",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DASHBOARD_OVERVIEW: "/dashboard/overview",
  DASHBOARD_WORKOUTS: "/dashboard/workouts",
  DASHBOARD_NUTRITION: "/dashboard/nutrition",
  DASHBOARD_PROGRESS: "/dashboard/progress",
  DASHBOARD_PROFILE: "/dashboard/profile", // Added
  AFFILIATE: "/affiliate", // Added
};

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: "Home", path: ROUTES.HOME },
  { label: "Planos", path: ROUTES.PLANS },
  { label: "Sobre", path: ROUTES.ABOUT },
  { label: "Comunidade", path: ROUTES.COMMUNITY }, // Ensured Community is here
  { label: "FAQ", path: ROUTES.FAQ },
];

export const AUTH_NAVIGATION_ITEMS: NavItem[] = [
  { label: "Login", path: ROUTES.LOGIN, icon: LogIn },
  { label: "Cadastro", path: ROUTES.REGISTER, icon: UserPlus },
];

export const DASHBOARD_NAVIGATION_ITEMS: NavItem[] = [
  { label: "Visão Geral", path: ROUTES.DASHBOARD_OVERVIEW, icon: LayoutDashboard },
  { label: "Meus Treinos", path: ROUTES.DASHBOARD_WORKOUTS, icon: Dumbbell },
  { label: "Minha Nutrição", path: ROUTES.DASHBOARD_NUTRITION, icon: Utensils },
  { label: "Meu Progresso", path: ROUTES.DASHBOARD_PROGRESS, icon: BarChart3 },
  // { label: "Comunidade IA", path: ROUTES.COMMUNITY, icon: Users }, // This would link outside dashboard, usually main nav
  { label: "Meu Perfil", path: ROUTES.DASHBOARD_PROFILE, icon: UserCircle2 }, // Updated icon and path
];

export const VALUE_PROPOSITIONS: ValueProposition[] = [
  { id: 1, title: "Treinamento Personalizado por IA", description: "Algoritmos adaptativos criam treinos únicos para seus objetivos e evolução.", icon: BrainCircuit },
  { id: 2, title: "Orientação Nutricional Inteligente", description: "Nutricionista IA 24/7 para planos alimentares e dicas personalizadas.", icon: Apple },
  { id: 3, title: "Apoio Contínuo Automatizado", description: "Chatbot motivacional e suporte para manter você focado e engajado.", icon: Bot },
  { id: 4, title: "Flexibilidade Total com IA", description: "IA adapta seus treinos e planos à sua rotina e equipamentos disponíveis.", icon: Activity },
  { id: 5, title: "Comunidade Inteligente", description: "Matching por IA para encontrar parceiros de treino e grupos de interesse.", icon: Users2 },
  { id: 6, title: "Resultados Comprovados", description: "Dashboard interativo com métricas, progresso visual e conquistas.", icon: TrendingUp },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: SubscriptionTier.Basic,
    name: "Básico",
    pricePerMonth: 49,
    features: [
      { text: "IA Personal Trainer básica", included: true },
      { text: "3 treinos personalizados/semana", included: true },
      { text: "Plano nutricional básico", included: true },
      { text: "Acesso à comunidade", included: true },
      { text: "Nutricionista IA 24/7", included: false },
      { text: "Análises corporais detalhadas", included: false },
    ],
    ctaText: "Começar Agora",
  },
  {
    id: SubscriptionTier.Premium,
    name: "Premium",
    pricePerMonth: 99,
    features: [
      { text: "IA Personal Trainer avançada", included: true },
      { text: "Treinos ilimitados", included: true },
      { text: "Nutricionista IA 24/7", included: true },
      { text: "Análises corporais detalhadas", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "IA Coach pessoal dedicada", included: false },
    ],
    ctaText: "Escolher Premium",
    highlight: true,
  },
  {
    id: SubscriptionTier.Elite,
    name: "Elite",
    pricePerMonth: 149,
    features: [
      { text: "Tudo do Premium", included: true },
      { text: "IA Coach pessoal dedicada", included: true },
      { text: "Planos de suplementação por IA", included: true },
      { text: "Consultoria médica virtual (simulada)", included: true },
      { text: "Acesso antecipado a novas features", included: true },
    ],
    ctaText: "Seja Elite",
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Ana Silva', avatarUrl: 'https://picsum.photos/seed/ana/100/100', rating: 5, text: 'O FitLife transformou minha rotina! Os treinos são perfeitos para mim e a IA nutricionista é incrível.', category: 'Perda de Peso' },
  { id: '2', name: 'Carlos Pereira', avatarUrl: 'https://picsum.photos/seed/carlos/100/100', rating: 4, text: 'Finalmente encontrei uma plataforma que se adapta ao meu dia a dia. Recomendo!', category: 'Ganho de Massa' },
  { id: '3', name: 'Julia Santos', avatarUrl: 'https://picsum.photos/seed/julia/100/100', rating: 5, text: 'A comunidade é super motivadora e os desafios da IA me mantêm engajada. Adorei!', category: 'Bem-Estar Geral' },
  { id: '4', name: 'Marcos Lima', avatarUrl: 'https://picsum.photos/seed/marcos/100/100', rating: 5, text: 'Resultados visíveis em poucas semanas. A IA realmente entende minhas necessidades.', category: 'Performance' },
];

export const MOCK_FAQS: FaqItem[] = [
  { id: '1', question: 'Como a IA personaliza meus treinos?', answer: 'Nossa IA analisa seu nível de condicionamento, objetivos, tempo e equipamentos disponíveis para criar um plano de treino único e progressivo para você.', category: 'Treinos' },
  { id: '2', question: 'Os planos nutricionais são criados por nutricionistas reais?', answer: 'Nossos planos são gerados por uma IA nutricional avançada, treinada com vastos dados de nutrição e dietética. Para casos médicos específicos, recomendamos consultar um profissional.', category: 'Nutrição' },
  { id: '3', question: 'Posso cancelar minha assinatura a qualquer momento?', answer: 'Sim, você pode cancelar sua assinatura a qualquer momento através do seu painel de controle, sem taxas adicionais.', category: 'Planos e Pagamentos' },
  { id: '4', question: 'Como funciona o matching por IA na comunidade?', answer: 'A IA analisa seus interesses, objetivos e nível de atividade para sugerir parceiros de treino e grupos que possam ser compatíveis com seu perfil.', category: 'Comunidade' },
  { id: '5', question: 'O que acontece se eu perder um treino?', answer: 'Não se preocupe! A IA pode ajustar seu plano para acomodar imprevistos. Você também pode reagendar treinos ou solicitar um treino alternativo.', category: 'Treinos' },
];

export const MOCK_EXERCISES: Exercise[] = [
  { id: 'ex001', name: 'Agachamento Livre', description: 'Fortalece pernas e glúteos. Mantenha a postura correta.', videoUrl: 'https://picsum.photos/seed/squat/300/200', muscleGroups: ['Quadríceps', 'Glúteos', 'Isquiotibiais'], difficulty: FitnessLevel.Intermediate, equipmentNeeded: ['Barra', 'Anilhas (opcional)'] },
  { id: 'ex002', name: 'Flexão de Braço', description: 'Trabalha peitoral, ombros e tríceps.', videoUrl: 'https://picsum.photos/seed/pushup/300/200', muscleGroups: ['Peitoral', 'Ombros', 'Tríceps'], difficulty: FitnessLevel.Beginner },
  { id: 'ex003', name: 'Prancha Abdominal', description: 'Fortalece o core. Mantenha o corpo alinhado.', videoUrl: 'https://picsum.photos/seed/plank/300/200', muscleGroups: ['Abdômen', 'Core'], difficulty: FitnessLevel.Beginner },
  { id: 'ex004', name: 'Levantamento Terra', description: 'Exercício composto que trabalha múltiplos grupos musculares.', videoUrl: 'https://picsum.photos/seed/deadlift/300/200', muscleGroups: ['Costas', 'Glúteos', 'Isquiotibiais', 'Core'], difficulty: FitnessLevel.Advanced, equipmentNeeded: ['Barra', 'Anilhas'] },
  { id: 'ex005', name: 'Corrida Estacionária', description: 'Ótimo para aquecimento e cardio leve.', videoUrl: 'https://picsum.photos/seed/jogging/300/200', muscleGroups: ['Cardiovascular', 'Pernas'], difficulty: FitnessLevel.Beginner },
  { id: 'ex006', name: 'Afundo', description: 'Excelente para fortalecer pernas e glúteos de forma unilateral.', videoUrl: 'https://picsum.photos/seed/lunge/300/200', muscleGroups: ['Quadríceps', 'Glúteos'], difficulty: FitnessLevel.Intermediate, equipmentNeeded: ['Halteres (opcional)'] },
  { id: 'ex007', name: 'Barra Fixa', description: 'Desenvolve força na parte superior das costas e braços.', videoUrl: 'https://picsum.photos/seed/pullup/300/200', muscleGroups: ['Costas', 'Bíceps'], difficulty: FitnessLevel.Advanced, equipmentNeeded: ['Barra de pull-up'] },
  { id: 'ex008', name: 'Rosca Direta com Halteres', description: 'Focado no fortalecimento do bíceps.', videoUrl: 'https://picsum.photos/seed/bicepcurl/300/200', muscleGroups: ['Bíceps'], difficulty: FitnessLevel.Beginner, equipmentNeeded: ['Halteres'] },
  { id: 'ex009', name: 'Tríceps Francês', description: 'Trabalha o tríceps para braços mais definidos.', videoUrl: 'https://picsum.photos/seed/tricepext/300/200', muscleGroups: ['Tríceps'], difficulty: FitnessLevel.Intermediate, equipmentNeeded: ['Halter', 'Barra EZ'] },
  { id: 'ex010', name: 'Elevação Lateral', description: 'Desenvolve a porção medial dos ombros.', videoUrl: 'https://picsum.photos/seed/latraise/300/200', muscleGroups: ['Ombros'], difficulty: FitnessLevel.Beginner, equipmentNeeded: ['Halteres'] },
];

export const DEFAULT_USER_FITNESS_LEVEL = FitnessLevel.Beginner;
export const DEFAULT_USER_GOALS = ['Melhorar condicionamento'];
export const DEFAULT_USER_EQUIPMENT: string[] = ['Nenhum (Peso Corporal)'];
export const DEFAULT_USER_TIME_PER_SESSION = 30; // minutes

export const THEME_KEY = 'fitlife-theme';

export const MOCK_COMMUNITY_POSTS = [
  { id: 'cp1', author: 'FitLife AI', avatarUrl: '/vite.svg', content: '💪 Novo desafio semanal lançado! Queime 500 calorias extras esta semana e ganhe pontos! #FitLifeChallenge', timestamp: new Date(Date.now() - 3600000 * 2), likes: 152, comments: 12 },
  { id: 'cp2', author: 'FitLife AI', avatarUrl: '/vite.svg', content: '🥗 Dica de nutrição: Adicione mais vegetais coloridos ao seu prato para um boost de vitaminas e antioxidantes! #NutricaoInteligente', timestamp: new Date(Date.now() - 3600000 * 5), likes: 230, comments: 25 },
  { id: 'cp3', author: 'Ana Silva', avatarUrl: 'https://picsum.photos/seed/ana/100/100', content: 'Acabei meu treino de hoje gerado pela IA! Morta, mas feliz! Quem mais treinou hoje?', timestamp: new Date(Date.now() - 3600000 * 1), likes: 88, comments: 18 },
];

export const MOCK_COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  { id: 'ch1', title: 'Desafio 7 Dias de Cardio', description: 'Complete 30 minutos de cardio todos os dias por 7 dias seguidos.', generatedBy: 'AI', durationDays: 7, rewardPoints: 100 },
  { id: 'ch2', title: 'Mestre da Prancha', description: 'Aumente seu tempo de prancha em 30 segundos até o final da semana.', generatedBy: 'AI', durationDays: 7, rewardPoints: 75 },
];

export const FOOTER_LINKS: NavItem[] = [ // Added for footer structure
    { label: 'Sobre Nós', path: ROUTES.ABOUT },
    { label: 'Planos', path: ROUTES.PLANS },
    { label: 'FAQ', path: ROUTES.FAQ },
    { label: 'Programa de Afiliados', path: ROUTES.AFFILIATE, icon: Handshake },
    { label: 'Termos de Serviço', path: '#' }, // Placeholder
    { label: 'Política de Privacidade', path: '#' }, // Placeholder
];
