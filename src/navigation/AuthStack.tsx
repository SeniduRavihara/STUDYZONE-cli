// AuthStack.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoadingScreen from '../screens/LoadingScreen';
import ForgetPasswordScreen from '../screens/auth_stack/ForgetPasswordScreen';
import LoginScreen from '../screens/auth_stack/LoginScreen';
import RegisterScreen from '../screens/auth_stack/RegisterScreen';

export type AuthStackParamList = {
  Loading: undefined;
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
