
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
      // First try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!error && data.user) {
        await fetchUserProfile(data.user.id);
        return true;
      }

      // If Supabase auth fails, try dummy credentials
      console.log('Supabase auth failed, trying dummy credentials...');
      const dummyUser = loginWithDummyCredentials(email, password);
      
      if (dummyUser) {
        setUser(dummyUser);
        setIsLoading(false);
        return true;
      }
      
      console.error('Login failed for both Supabase and dummy credentials');
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      
      // Try dummy credentials as fallback
      const dummyUser = loginWithDummyCredentials(email, password);
      
      if (dummyUser) {
        setUser(dummyUser);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
