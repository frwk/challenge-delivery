import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import { User } from '@/types/user';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContextProps, CheckAuthResponse, LoginDto, LoginResponse, LogoutResponse } from '@/types/auth';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = pathname !== '/login' && pathname !== '/signup';

  const authenticateUser = async () => {
    try {
      const { data, error }: CheckAuthResponse = await authService.checkAuth();
      if (error) throw new Error(error.message);
      if (data) {
        setUser(data);
        if (pathname === '/login' || pathname === '/signup') {
          router.push('/');
        }
      }
    } catch (error) {
      if (isProtectedRoute) {
        router.push('/login');
      }
      console.error('Error authenticating user', error);
    }
  };

  const login = async (data: LoginDto): Promise<LoginResponse> => {
    const { data: userData, error } = await authService.login(data);
    if (error) return { error: error };
    if (userData) {
      setUser(userData);
      router.refresh();
      return { data: userData };
    }
    return { error: { message: 'Erreur inconnue', statusCode: 500 } };
  };

  const logout = async (): Promise<void> => {
    try {
      const { error }: LogoutResponse = await authService.logout();
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error('Error during logout', error);
    }
    setUser(null);
    router.refresh();
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  const contextValue = {
    user,
    login,
    logout,
    authenticateUser,
  };
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
