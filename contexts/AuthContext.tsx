import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

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
  token: string;
  address?: {
    street: string;
    number?: string;
    cep?: string;
    id?: string;
  };
  notificationPreferences?: ('APP' | 'WHATSAPP')[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType?: UserType) => Promise<void>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateUserPassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string, userType?: UserType) => {
    setIsLoading(true);
    try {
      const data = await api.post<any>('/auth/login', { email, password });

      const loggedInUser: User = {
        id: data.id,
        name: data.name,
        email,
        type: data.role?.toLowerCase() || userType || 'customer',
        token: data.token,
        avatar: data.avatar,
        phone: data.phone,
        rating: data.rating,
        services: data.services,
        categories: data.categories,
        address: data.address,
        notificationPreferences: data.notificationPreferences,
      };
      setUser(loggedInUser);
      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
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
      const data = await api.post<any>('/auth/register', {
        name,
        email,
        password,
        role: userType.toUpperCase(),
        address: {
          street: 'Some Street',
          number: '123',
          zipCode: '12345-678',
          city: 'Some City',
          state: 'Some State',
          neighborhood: 'Some Neighborhood',
        },
      });

      const registeredUser: User = {
        id: data.id,
        name,
        email,
        type: userType,
        token: data.token,
        avatar: data.avatar,
        phone: data.phone,
        rating: data.rating,
        services: data.services,
        categories: data.categories,
        address: data.address,
        notificationPreferences: data.notificationPreferences,
      };
      setUser(registeredUser);
      await AsyncStorage.setItem('user', JSON.stringify(registeredUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user || !user.token) return;
    setIsLoading(true);
    try {
      const data = await api.get<any>('/user', user.token);
      const refreshedUser = { ...user, ...data };
      setUser(refreshedUser);
      await AsyncStorage.setItem('user', JSON.stringify(refreshedUser));
    } catch (error) {
      console.error('Refresh user error:', error);
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user || !user.token) throw new Error('User not authenticated');
    setIsLoading(true);
    try {
      const updatedUser = await api.patch<any>('/user', userData, user.token);
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPassword = async (oldPassword: string, newPassword: string) => {
    if (!user || !user.token) throw new Error('User not authenticated');
    setIsLoading(true);
    try {
      await api.patch('/user/update-password', { oldPassword, newPassword }, user.token);
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Failed to remove user from storage', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      refreshUser, 
      updateUser, 
      updateUserPassword 
    }}>
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