// LoadingScreen.tsx
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../hooks/useAuth';
import {AuthStackParamList} from '../navigation/AuthStack';
import {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  AuthStackParamList & RootStackParamList,
  'Loading'
>;

const LoadingScreen = ({navigation}: Props) => {
  const {currentUser, loading} = useAuth();
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Create animated dots effect
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) {
          return '';
        }
        return prevDots + '•';
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      if (loading) {
        return;
      }
      try {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/images/logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>STUDY ZONE</Text>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading{dots}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 32,
    letterSpacing: 1,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    letterSpacing: 1,
  },
});

export default LoadingScreen;
