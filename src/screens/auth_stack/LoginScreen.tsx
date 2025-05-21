// LoginScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {doc, getDoc} from 'firebase/firestore';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {db} from '../../firebase/config';
import {AuthStackParamList} from '../../navigation/AuthStack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {hashPassword} from '../../utils/hashPassword';

type Props = NativeStackScreenProps<
  AuthStackParamList & RootStackParamList,
  'Login'
>;

const LoginScreen = ({navigation}: Props) => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Basic validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {...errors};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle login
  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const hashedPassword = await hashPassword(password);
        const userDocRef = doc(db, 'users', email);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          if (userData.password === hashedPassword) {
            // Save session using AsyncStorage
            await AsyncStorage.setItem('userToken', email);

            navigation.navigate('App', {
              screen: 'Home',
            });
          } else {
            Alert.alert('Error', 'Incorrect password');
          }
        } else {
          Alert.alert('Error', 'User not found. Please register first.');
        }
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert(
          'Login Failed',
          'There was a problem logging in. Please try again.',
          [{text: 'OK'}],
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Navigate to register screen
  const goToRegister = () => {
    navigation.navigate('Register');
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Main Container */}
        <View style={styles.mainContainer}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Login</Text>
            <Text style={styles.headerSubtitle}>Sign in to continue.</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={styles.textInput}
                placeholder="hello@reallygreatsite.com"
                placeholderTextColor="#1F2937"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (text.trim()) {
                    setErrors({...errors, email: ''});
                  }
                }}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                style={styles.textInput}
                placeholder="••••••"
                placeholderTextColor="#1F2937"
                secureTextEntry
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (text) {
                    setErrors({...errors, password: ''});
                  }
                }}
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}>
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'log in'}
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don&apos;t have an account?{' '}
              <Text onPress={goToRegister} style={styles.registerLink}>
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  logoContainer: {
    // alignItems: "center",
    marginBottom: 60,
    width: '100%',
    backgroundColor: 'red',
  },
  logo: {
    position: 'absolute',
    top: -10,
    right: 0,
    height: 64,
    width: 64,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937', // gray-900, matching the registration page
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4B5563', // gray-600, matching the registration page
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#4B5563', // gray-600, matching the registration page
    marginBottom: 4,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300, matching the registration page
    borderRadius: 4,
    padding: 12,
    width: '100%',
    color: '#1F2937', // gray-800, matching the registration page
  },
  placeholderText: {
    color: '#1F2937', // Makes placeholder text full opacity
  },
  errorText: {
    color: '#EF4444', // red-500, matching the registration page
    fontSize: 12,
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4B5563', // gray-600, matching the registration page
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: 'black',
    width: '100%',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#666',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: '#4B5563', // gray-600, matching the registration page
  },
  registerLink: {
    color: '#2563EB', // blue-600, matching the registration page
    fontWeight: 'medium',
  },
});

export default LoginScreen;
