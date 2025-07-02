import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  token: string; // Add token to User interface
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateUserPassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import api from '../services/api';
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<User>('/auth/login', { email, password });

      const loggedInUser: User = {
        id: data.id,
        name: data.name,
        email,
        type: data.role.toLowerCase(), // Set user type from backend response
        token: data.token,
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
      const data = await api.post<User>('/auth/register', {
        name,
        email,
        password,
        role: userType.toUpperCase(), // Backend expects 'CUSTOMER' or 'PROVIDER'
        address: { // Placeholder address, adjust as per backend requirements
          street: 'Some Street',
          number: '123',
          zipCode: '12345-678',
          city: 'Some City',
          state: 'Some State',
          neighborhood: 'Some Neighborhood',
        },
      });

      const registeredUser: User = {
        id: data.id, // Assuming backend returns user id
        name,
        email,
        type: userType,
        token: data.token,
        // You might need to fetch more user details after registration
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
      const data = await api.get<User>('/user', user.token);
      const refreshedUser = { ...user, ...data };
      setUser(refreshedUser);
      await AsyncStorage.setItem('user', JSON.stringify(refreshedUser));
    } catch (error) {
      console.error('Refresh user error:', error);
      // Optionally logout if token is invalid
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
      const updatedUser = await api.patch<User>('/user', userData, user.token);
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
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
      // Password updated successfully, no need to update user state with password
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
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, refreshUser, updateUser, updateUserPassword }}>
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