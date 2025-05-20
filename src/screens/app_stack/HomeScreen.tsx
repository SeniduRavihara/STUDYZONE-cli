// HomeScreen.tsx
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppStackParamList } from '../../navigation/AppStack';


type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {
  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    // Navigate back to the auth stack
    navigation.navigate('Auth', {screen: 'Login'});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your App</Text>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Dashboard</Text>
          <Text style={styles.cardText}>
            This is your home screen where you can see an overview of your
            activities.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <Text style={styles.cardText}>No recent activities found.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  quickAction: {
    backgroundColor: '#e9ecef',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  quickActionText: {
    color: '#495057',
    fontWeight: '500',
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
