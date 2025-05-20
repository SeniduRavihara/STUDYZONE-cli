import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import LoadingScreen from '../screens/LoadingScreen';
import AdminStack from './AdminStack';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { useAuth } from '../hooks/useAuth';

export default function RootNavigator() {
  const {currentUser, loading} = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {!currentUser ? (
        <AuthStack />
      ) : currentUser.isAdmin ? (
        <AdminStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
}
