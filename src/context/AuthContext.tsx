// src/context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doc, getDoc} from 'firebase/firestore';
import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {db} from '../firebase/config';
import {AuthContextType, CurrentUser} from '../types';
import {hashPassword} from '../utils/hashPassword';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const loadInitialSession = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('token');
        console.log(storedEmail);

        if (storedEmail) {
          const userDocSnapshot = await getDoc(doc(db, 'users', storedEmail));
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {password: _, ...userWithoutPassword} = userData;
            setCurrentUser(userWithoutPassword as CurrentUser);
            console.log('User data:', userWithoutPassword);
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    loadInitialSession();
  }, []);

  // 🔐 Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const hashedPassword = await hashPassword(password);
      const userDocRef = doc(db, 'users', email);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        if (userData.password === hashedPassword) {
          // Save session token
          await AsyncStorage.setItem('token', email);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {password: _, ...userWithoutPassword} = userData;
          setCurrentUser(userWithoutPassword as CurrentUser);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // 🔐 Logout function
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setCurrentUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo registration - in a real app, send to your backend
      if (name && email && password) {
        // Registration successful, but user needs to login
        return;
      } else {
        throw new Error('Invalid registration details');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo forgot password - in a real app, send to your backend
      if (email) {
        return;
      } else {
        throw new Error('Please provide a valid email');
      }
    } catch (error) {
      console.error('Forgot password request failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    login,
    register,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
