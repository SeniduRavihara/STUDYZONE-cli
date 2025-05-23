// AppStack.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/app_stack/HomeScreen';
import SelectModuleScreen from '../screens/app_stack/SelectModuleScreen';
import SelectSemesterScreen from '../screens/app_stack/SelectSemesterScreen';
import SelectYearScreen from '../screens/app_stack/SelectYearScreen';

export type AppStackParamList = {
  Home: undefined;
  SelectYear: undefined;
  SelectSemester: {
    academicYear: string;
  };
  SelectModule: {
    academicYear: string;
    semester: string;
  };
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
      <Stack.Screen name="SelectYear" component={SelectYearScreen} />
      <Stack.Screen name="SelectSemester" component={SelectSemesterScreen} />
      <Stack.Screen name="SelectModule" component={SelectModuleScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
