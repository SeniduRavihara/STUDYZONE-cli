import React from 'react';
import 'react-native-reanimated';
import AuthContextProvider from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthContextProvider>
      {/* <StatusBar barStyle="dark-content" /> */}
      <RootNavigator />
    </AuthContextProvider>
  );
}
