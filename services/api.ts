import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = Platform.OS === 'web'
  ? process.env.EXPO_PUBLIC_API_URL_WEB || 'http://localhost:3000/api'
  : process.env.EXPO_PUBLIC_API_URL_MOBILE || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token || await AsyncStorage.getItem('userToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorText;
    } catch {
      errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  // Handle cases where the response might be empty (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return {} as T; // Return an empty object for non-JSON responses
  }
}

const api = {
  get: <T>(url: string, token?: string) => request<T>(url, { method: 'GET', token }),
  post: <T>(url: string, data: any, token?: string) => request<T>(url, { method: 'POST', body: JSON.stringify(data), token }),
  patch: <T>(url: string, data: any, token?: string) => request<T>(url, { method: 'PATCH', body: JSON.stringify(data), token }),
  put: <T>(url: string, data: any, token?: string) => request<T>(url, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: <T>(url: string, token?: string) => request<T>(url, { method: 'DELETE', token }),
};

export default api;