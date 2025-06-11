import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration with all three roles
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hospital.com',
    name: 'System Administrator',
    role: 'admin',
    department: 'IT',
    createdAt: '2024-01-01T08:00:00Z',
    isActive: true,
  },
  {
    id: '2',
    email: 'dr.smith@hospital.com',
    name: 'Dr. Sarah Smith',
    role: 'doctor',
    department: 'Cardiology',
    createdAt: '2024-01-15T08:00:00Z',
    isActive: true,
  },
  {
    id: '3',
    email: 'nurse.johnson@hospital.com',
    name: 'Nurse Michael Johnson',
    role: 'nurse',
    department: 'Emergency',
    createdAt: '2024-01-20T09:30:00Z',
    isActive: true,
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('healthcare_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verify user is still active
        const currentUser = mockUsers.find(u => u.id === parsedUser.id);
        if (currentUser && currentUser.isActive) {
          setUser(currentUser);
        } else {
          localStorage.removeItem('healthcare_user');
        }
      } catch (error) {
        localStorage.removeItem('healthcare_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in production, this would be a real API call
    const foundUser = mockUsers.find(u => u.email === email && u.isActive);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('healthcare_user', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthcare_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};