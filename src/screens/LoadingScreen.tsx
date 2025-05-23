// LoadingScreen.tsx
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useAuth} from '../hooks/useAuth';
import {AuthStackParamList} from '../navigation/AuthStack';
import {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  AuthStackParamList & RootStackParamList,
  'Loading'
>;

const LoadingScreen = ({navigation}: Props) => {
  const {currentUser, loading} = useAuth();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      if(loading) {
        return;
      }
      try {
        // await new Promise(resolve => setTimeout(resolve, 1500));

        if (currentUser) {
          // User is logged in, navigate to Home
          navigation.navigate('App', {
            screen: 'Home',
          });
        } else {
          // User is not logged in, navigate to Login
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigation.navigate('Login');
      }
    };

    checkAuth();
  }, [currentUser, navigation, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  links: {
    width: '100%',
    alignItems: 'center',
  },
  link: {
    color: '#007bff',
    marginVertical: 10,
    textAlign: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
export default LoadingScreen;
