
import { LucideIcon } from 'lucide-react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: SubscriptionTier;
  // Add more user-specific data like fitness level, goals, etc.
  fitnessLevel?: FitnessLevel;
  goals?: string[];
  availableEquipment?: string[];
  timePerSession?: number; // minutes
  age?: number; // Added
  gender?: Gender; // Added
}

export enum SubscriptionTier {
  None = 'None',
  Basic = 'Basic',
  Premium = 'Premium',
  Elite = 'Elite',
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: SubscriptionTier;
  name: string;
  pricePerMonth: number;
  features: PlanFeature[];
  ctaText: string;
  highlight?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl: string; // placeholder or actual video link
  muscleGroups: string[];
  equipmentNeeded?: string[];
  difficulty: FitnessLevel;
}

export enum FitnessLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export interface WorkoutExercise {
  exerciseId: string; // references Exercise.id
  name: string; // denormalized for easy display
  sets: string; // e.g., "3-4"
  reps: string; // e.g., "8-12"
  rest: string; // e.g., "60s"
  videoUrl?: string; // denormalized
}

export interface WorkoutDay {
  day: string; // e.g., "Day 1", "Monday"
  focus: string; // e.g., "Full Body", "Upper Body"
  exercises: WorkoutExercise[];
  estimatedDurationMinutes?: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  days: WorkoutDay[];
  fitnessLevel: FitnessLevel;
  goals: string[];
}

export interface Meal {
  name: string;
  description: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface DailyMealPlan {
  day: string; // e.g., "Monday"
  meals: {
    breakfast: Meal;
    snack1?: Meal;
    lunch: Meal;
    snack2?: Meal;
    dinner: Meal;
  };
  totalCalories?: number;
}

export interface NutritionPlan {
  id: string;
  name: string;
  description?: string;
  dailyCalorieTarget: number;
  days: DailyMealPlan[];
}

export interface Testimonial {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number; // 1-5
  text: string;
  category: string; // e.g., "Perda de Peso", "Ganho de Massa"
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: LucideIcon; // For dashboard sidebar
  requiresAuth?: boolean;
  children?: NavItem[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ValueProposition {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ProgressDataPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface ProgressMetric {
  name: string; // e.g., "Weight", "Workout Duration"
  unit: string; // e.g., "kg", "min"
  data: ProgressDataPoint[];
}

export interface CommunityPost {
  id: string;
  author: string; // "FitLife AI" or user name
  avatarUrl?: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  generatedBy: "AI" | "User"; // Added User type
  durationDays: number;
  rewardPoints?: number;
}

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface BodyScanMetrics {
  date: string; // YYYY-MM-DD
  weightKg?: number;
  heightCm?: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  bmi?: number;
  age?: number;
  gender?: Gender;
  activityLevel?: ActivityLevel;
}
