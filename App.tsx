// App.tsx
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
