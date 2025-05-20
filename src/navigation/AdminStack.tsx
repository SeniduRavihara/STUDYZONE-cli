// AdminStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminScreen from '../screens/admin_stack/AdminScreen';

export type AdminStackParamList = {
  Admin: undefined;
  // Add more admin screens here
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Admin"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Admin" component={AdminScreen} />
      {/* Add more admin screens here */}
    </Stack.Navigator>
  );
};

export default AdminStack;
