// RegisterScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {collection, doc, getDoc, setDoc} from 'firebase/firestore';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
  'Register'
>;

const RegisterScreen = ({navigation}: Props) => {
  const scrollViewRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // Handle keyboard show if needed
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Handle keyboard hide if needed
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Basic validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {...errors};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else {
      newErrors.name = '';
    }

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

    // Confirm Password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle sign up
  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const hashedPassword = await hashPassword(password);
      const usersRef = collection(db, 'users');

      const user = await getDoc(doc(usersRef, email));
      if (user.exists()) {
        Alert.alert('Error', 'Email already exists');
        return;
      }

      await setDoc(doc(usersRef, email), {
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        isAdmin: false,
      });

      // Store session using AsyncStorage
      await AsyncStorage.setItem('userToken', email);

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('App', {
              screen: 'Home',
            });
          },
        },
      ]);
    } catch (error) {
      console.error('Sign-up failed:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // Navigate to login screen
  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>
              Already have an account?{' '}
              <Text onPress={goToLogin} style={styles.loginLink}>
                Sign in
              </Text>
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon
                name="account-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Full Name"
                placeholderTextColor="#666"
                value={name}
                onChangeText={text => {
                  setName(text);
                  if (text.trim()) {
                    setErrors({...errors, name: ''});
                  }
                }}
              />
            </View>
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

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

            <View style={styles.inputContainer}>
              <Icon
                name="lock-check-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm Password"
                placeholderTextColor="#666"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  if (text) {
                    setErrors({...errors, confirmPassword: ''});
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Create Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
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
  loginLink: {
    color: '#2563EB',
    fontWeight: '600',
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
  signUpButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;
