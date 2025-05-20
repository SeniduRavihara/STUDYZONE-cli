// AppStack.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/app_stack/HomeScreen';

export type AppStackParamList = {
  Home: undefined;
  // Add more screens here
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Add more screens here */}
    </Stack.Navigator>
  );
};

export default AppStack;
