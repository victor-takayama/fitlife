
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, SubscriptionTier } from '../types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: Omit<User, 'id' | 'plan'>) => Promise<void>; // Simulate API call
  register: (userData: Omit<User, 'id' | 'plan'>) => Promise<void>; // Simulate API call
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
  const [isLoading, setIsLoading] = useState<boolean>(false); // For simulated API calls

  // Simulate loading user from session on mount (if any)
  // In a real app, this would be a token check
  useEffect(() => {
    const storedUser = sessionStorage.getItem('fitlife-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData: Omit<User, 'id' | 'plan'>): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const loggedInUser: User = { 
        ...userData, 
        id: `user-${Math.random().toString(36).substr(2, 9)}`, 
        plan: SubscriptionTier.Basic, // Default to basic plan on login
        avatarUrl: `https://picsum.photos/seed/${userData.name}/100/100`
    };
    setUser(loggedInUser);
    sessionStorage.setItem('fitlife-user', JSON.stringify(loggedInUser));
    setIsLoading(false);
  };

  const register = async (userData: Omit<User, 'id' | 'plan'>): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newUser: User = { 
        ...userData, 
        id: `user-${Math.random().toString(36).substr(2, 9)}`, 
        plan: SubscriptionTier.None, // New users start with no plan
        avatarUrl: `https://picsum.photos/seed/${userData.name}/100/100`
    }; 
    setUser(newUser); // Or automatically log them in
    sessionStorage.setItem('fitlife-user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('fitlife-user');
    // In a real app, invalidate token on server
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
    