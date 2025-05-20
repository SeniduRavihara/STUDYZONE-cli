import AsyncStorage from '@react-native-async-storage/async-storage';
import {doc, getDoc} from 'firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import {INITIAL_AUTH_CONTEXT} from '../constants';
import {AuthContextType, CurrentUser} from '../types';
import { hashPassword } from '../utils/hashPassword';
import { db } from '../firebase/config';

export const AuthContext = createContext<AuthContextType>(INITIAL_AUTH_CONTEXT);

const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

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

  // 🚪 Check session on app start
  useEffect(() => {
    const loadInitialSession = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('token');

        if (storedEmail) {
          const userDocSnapshot = await getDoc(doc(db, 'users', storedEmail));
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const {password: _, ...userWithoutPassword} = userData;
            setCurrentUser(userWithoutPassword as CurrentUser);
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

  const value = {
    currentUser,
    setCurrentUser,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
