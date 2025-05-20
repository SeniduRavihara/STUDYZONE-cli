// ForgetPasswordScreen.tsx
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AuthStackParamList} from '../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgetPassword'>;

const ForgetPasswordScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Add your password reset logic here
    console.log('Password reset request for:', email);

    // Show success message and navigate back to login
    alert('Password reset instructions sent to your email!');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <Text style={styles.description}>
        Enter your email address and we'll send you instructions to reset your
        password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
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

// Use React Native's Alert API for showing alerts

function alert(message: string) {
  Alert.alert('Notice', message, [{text: 'OK'}]);
}

export default ForgetPasswordScreen;
