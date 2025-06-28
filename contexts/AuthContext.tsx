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

  const API_BASE_URL = 'http://localhost:5000/api/v1';

  const login = async (email: string, password: string, userType: UserType) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, type: userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        type: data.user.type,
        avatar: data.user.avatar,
        phone: data.user.phone,
        rating: data.user.rating,
        services: data.user.services,
        categories: data.user.categories,
        token: data.token, // Store the token
      };

      setUser(user);
      // In a real app, you'd store the token (e.g., AsyncStorage)
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, userType: UserType) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, type: userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        type: data.user.type,
        avatar: data.user.avatar,
        phone: data.user.phone,
        rating: data.user.rating,
        services: data.user.services,
        categories: data.user.categories,
      };

      setUser(user);
      // In a real app, you'd store the token (e.g., AsyncStorage)
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
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