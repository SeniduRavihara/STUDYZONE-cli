// RootNavigator.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {useAuth} from '../hooks/useAuth';
import AdminStack, {AdminStackParamList} from './AdminStack';
import AppStack, {AppStackParamList} from './AppStack';
import AuthStack, {AuthStackParamList} from './AuthStack';

export type RootStackParamList = {
  Auth: {screen: keyof AuthStackParamList} | undefined;
  App: {screen: keyof AppStackParamList} | undefined;
  Admin: {screen: keyof AdminStackParamList} | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const {currentUser} = useAuth();

  // console.error('SENUUU');

  // Determine initial route based on auth state
  const getInitialRouteName = (): keyof RootStackParamList => {
    if (!currentUser) {
      return 'Auth';
    }

    if (currentUser.isAdmin) {
      return 'Admin';
    }

    return 'App';
  };

  return (
    <>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="App" component={AppStack} />
        <Stack.Screen name="Admin" component={AdminStack} />
      </Stack.Navigator>
    </>
  );
};

export default RootNavigator;
