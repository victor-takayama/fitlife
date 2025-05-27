
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, SubscriptionTier, FitnessLevel, Gender } from '../types'; // Added Gender
import { DEFAULT_USER_FITNESS_LEVEL, DEFAULT_USER_GOALS, DEFAULT_USER_EQUIPMENT, DEFAULT_USER_TIME_PER_SESSION } from '../constants';


export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: Partial<Omit<User, 'id' | 'plan'>> & { email: string; name: string }) => Promise<void>; 
  register: (userData: Omit<User, 'id' | 'plan'> & {password?: string}) => Promise<void>; 
  logout: () => void;
  updateUserPlan: (plan: SubscriptionTier) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true for initial load

  useEffect(() => {
    setIsLoading(true);
    const storedUser = sessionStorage.getItem('fitlife-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        // console.error("Failed to parse stored user:", e); // Removed for cleaner production console
        sessionStorage.removeItem('fitlife-user');
      }
    }
    setIsLoading(false); 
  }, []);

  const login = async (userData: Partial<Omit<User, 'id' | 'plan'>> & { email: string; name: string }): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 700)); 

    const isProfileUpdate = user && user.email === userData.email;
    
    const baseUser: User = isProfileUpdate && user ? user : { // Ensure user is not null for isProfileUpdate case
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        plan: SubscriptionTier.Basic,
        avatarUrl: `https://picsum.photos/seed/${userData.name?.replace(/\s+/g, '') || 'default'}/100/100`,
        fitnessLevel: DEFAULT_USER_FITNESS_LEVEL,
        goals: [...DEFAULT_USER_GOALS],
        availableEquipment: [...DEFAULT_USER_EQUIPMENT],
        timePerSession: DEFAULT_USER_TIME_PER_SESSION,
        age: undefined,
        gender: undefined,
        // email and name will be overridden by userData
        email: userData.email,
        name: userData.name,
    };

    const loggedInUser: User = {
        ...baseUser, // Start with base or existing user data
        ...userData, // Override with new data from login/profile update
        // Ensure core fields are present
        id: baseUser.id,
        email: userData.email,
        name: userData.name,
        plan: isProfileUpdate && user ? user.plan : baseUser.plan, // Keep existing plan on profile update
    };
    
    setUser(loggedInUser);
    sessionStorage.setItem('fitlife-user', JSON.stringify(loggedInUser));
    setIsLoading(false);
  };

  const register = async (userData: Omit<User, 'id' | 'plan'> & {password?: string}): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = { 
        id: `user-${Math.random().toString(36).substr(2, 9)}`, 
        plan: SubscriptionTier.None, 
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl || `https://picsum.photos/seed/${userData.name.replace(/\s+/g, '')}/100/100`,
        fitnessLevel: userData.fitnessLevel || DEFAULT_USER_FITNESS_LEVEL,
        goals: userData.goals || [...DEFAULT_USER_GOALS],
        availableEquipment: userData.availableEquipment || [...DEFAULT_USER_EQUIPMENT],
        timePerSession: userData.timePerSession || DEFAULT_USER_TIME_PER_SESSION,
        age: userData.age,
        gender: userData.gender,
    }; 
    setUser(newUser); 
    sessionStorage.setItem('fitlife-user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('fitlife-user');
  };

  const updateUserPlan = (newPlan: SubscriptionTier) => {
    if (user) {
      const updatedUser = { ...user, plan: newPlan };
      setUser(updatedUser);
      sessionStorage.setItem('fitlife-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUserPlan, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};