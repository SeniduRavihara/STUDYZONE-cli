// LoginScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {doc, getDoc} from 'firebase/firestore';
import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {db} from '../../firebase/config';
import {AuthStackParamList} from '../../navigation/AuthStack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {hashPassword} from '../../utils/hashPassword';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<
  AuthStackParamList & RootStackParamList,
  'Login'
>;

const LoginScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {...errors};

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
            await AsyncStorage.setItem('token', email);
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

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <View style={styles.mainContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon
                name="email-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#666"
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
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <View style={styles.inputContainer}>
              <Icon
                name="lock-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (text) {
                    setErrors({...errors, password: ''});
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate('ForgetPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}>
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Don't have an account?{' '}
                <Text
                  onPress={() => navigation.navigate('Register')}
                  style={styles.registerLink}>
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
  },
  headerContainer: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    padding: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 12,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  registerLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
});

export default LoginScreen;
