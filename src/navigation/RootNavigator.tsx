// RootNavigator.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

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
  return (
    <>
      <Stack.Navigator
        initialRouteName="Auth"
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
