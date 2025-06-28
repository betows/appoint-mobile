import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserType = 'customer' | 'provider';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
  phone?: string;
  rating?: number;
  services?: string[];
  categories?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored auth token
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const login = async (email: string, password: string, userType: UserType) => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check for specific test credentials
      if (email === 'provider@example.com' && password === 'provider') {
        const mockUser: User = {
          id: 'provider-1',
          name: 'Encanadores Rápidos',
          email,
          type: 'provider',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          phone: '+55 (11) 99999-9999',
          rating: 4.8,
          services: ['Encanamento', 'Reparo Hidráulico'],
          categories: ['Encanador'],
        };
        
        setUser(mockUser);
        setIsLoading(false);
        return;
      }
      
      if (email === 'customer@example.com' && password === 'customer') {
        const mockUser: User = {
          id: 'customer-1',
          name: 'João Silva',
          email,
          type: 'customer',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          phone: '+55 (11) 88888-8888',
        };
        
        setUser(mockUser);
        setIsLoading(false);
        return;
      }
      
      // For any other credentials, simulate a failed login
      setIsLoading(false);
      throw new Error('Invalid credentials');
      
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, userType: UserType) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        type: userType,
        avatar: `https://images.pexels.com/photos/${userType === 'customer' ? '220453' : '2379004'}/pexels-photo-${userType === 'customer' ? '220453' : '2379004'}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
        phone: '+55 (11) 99999-9999',
        rating: userType === 'provider' ? 0 : undefined,
        services: userType === 'provider' ? [] : undefined,
        categories: userType === 'provider' ? [] : undefined,
      };
      
      setUser(mockUser);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}