import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AdminScreen from '../screens/admin_stack/AdminScreen';

const Stack = createNativeStackNavigator();
const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Admin" component={AdminScreen} />
    </Stack.Navigator>
  );
};
export default AdminStack;
