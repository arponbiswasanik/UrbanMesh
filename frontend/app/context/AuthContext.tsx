"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  avatar?: string; 
  is_admin?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; 
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Merge with existing avatar if we just uploaded one locally
        setUser(prev => prev ? { ...prev, ...data } : data);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setIsLoading(false); // Stop loading once checked
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('urbanmesh_token');
    if (token) {
      setIsAuthenticated(true);
      fetchUser(token);
    } else {
      setIsLoading(false); // Stop loading if no token
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('urbanmesh_token', token);
    setIsAuthenticated(true);
    fetchUser(token);
  };

  const updateUser = (newData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...newData } : null);
  };

  const logout = () => {
    localStorage.removeItem('urbanmesh_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, updateUser }}>
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