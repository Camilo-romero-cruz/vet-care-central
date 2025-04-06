
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { users } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  hasFeatureAccess: (feature: 'billing_view' | 'billing_create' | 'billing_payment' | 'financial_stats' | 'medical_diagnosis' | 'products_pricing') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in via localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API request
    // For this example, we'll just check against our mock data
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = users.find(u => u.email === email);
    
    if (user && password === '123456') { // Simple password for demo
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({
        title: '¡Bienvenido!',
        description: `Has iniciado sesión como ${user.name}.`,
      });
      setIsLoading(false);
      return true;
    }
    
    toast({
      title: 'Error de inicio de sesión',
      description: 'Email o contraseña incorrectos.',
      variant: 'destructive',
    });
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado la sesión correctamente.',
    });
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return requiredRoles.includes(currentUser.role);
  };

  // Sistema de permisos por características específicas según el rol
  const hasFeatureAccess = (feature: 'billing_view' | 'billing_create' | 'billing_payment' | 'financial_stats' | 'medical_diagnosis' | 'products_pricing'): boolean => {
    if (!currentUser) return false;
    
    const accessMap = {
      // Ver facturación (admin y recepcionista)
      billing_view: ['admin', 'receptionist'],
      
      // Crear facturas (solo recepcionista y admin)
      billing_create: ['admin', 'receptionist'],
      
      // Registrar pagos (solo recepcionista y admin)
      billing_payment: ['admin', 'receptionist'],
      
      // Ver estadísticas financieras (solo admin)
      financial_stats: ['admin'],
      
      // Registrar diagnóstico médico (veterinario y admin)
      medical_diagnosis: ['admin', 'veterinarian'],
      
      // Ver precios de productos y servicios (admin y recepcionista)
      products_pricing: ['admin', 'receptionist']
    };
    
    return accessMap[feature]?.includes(currentUser.role) || false;
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, hasPermission, hasFeatureAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
