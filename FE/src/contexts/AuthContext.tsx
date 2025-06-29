import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../lib/api';
import dummyUsersData from '../data/dummyUsers.json';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData: any = await apiService.getCurrentUser();
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Clear invalid token
      apiService.clearToken();
      setIsLoading(false);
    }
  };

  const loginWithDummyCredentials = (email: string, password: string): User | null => {
    console.log('Attempting dummy login for:', email);
    const dummyUser = dummyUsersData.users.find(
      user => user.email === email && user.password === password
    );
    
    if (dummyUser) {
      console.log('Dummy login successful for:', dummyUser.name);
      return {
        id: dummyUser.id,
        name: dummyUser.name,
        email: dummyUser.email,
        role: dummyUser.role as 'admin' | 'technician' | 'client',
        avatar: dummyUser.avatar
      };
    }
    
    return null;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try FastAPI authentication first
      const response: any = await apiService.login(email, password);
      
      if (response.access_token) {
        apiService.setToken(response.access_token);
        await fetchUserProfile();
        return true;
      }
    } catch (error) {
      console.error('FastAPI auth failed, trying dummy credentials...', error);
      
      // Fallback to dummy credentials
      const dummyUser = loginWithDummyCredentials(email, password);
      
      if (dummyUser) {
        setUser(dummyUser);
        // Set a dummy token for dummy users
        apiService.setToken('dummy-token-' + dummyUser.id);
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    apiService.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
