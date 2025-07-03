import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/v1' : 'http://localhost:5000/api/v1';

interface RequestOptions extends RequestInit {
  headers?: {
    [key: string]: string;
  };
}

const api = {
  get: async (endpoint: string, token?: string) => {
    return request('GET', endpoint, null, token);
  },
  post: async (endpoint: string, body: any, token?: string) => {
    return request('POST', endpoint, body, token);
  },
  patch: async (endpoint: string, body: any, token?: string) => {
    return request('PATCH', endpoint, body, token);
  },
  delete: async (endpoint: string, token?: string) => {
    return request('DELETE', endpoint, null, token);
  },
};

const request = async (method: string, endpoint: string, body: any, token?: string) => {
  const options: RequestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (response.status === 401) {
      const { logout } = useAuth();
      logout();
      router.replace('/auth/login');
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
};

export default api;