import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ForgetPassword from '../screens/auth_stack/ForgetPasswordScreen';
import LoginScreen from '../screens/auth_stack/LoginScreen';
import RegisterScreen from '../screens/auth_stack/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
}
