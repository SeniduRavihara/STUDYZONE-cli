// ForgetPasswordScreen.tsx
import {NativeStackScreenProps} from '@react-navigation/native-stack';
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
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthStackParamList} from '../../navigation/AuthStack';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgetPassword'>;

const ForgetPasswordScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({email: ''});

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

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = () => {
    if (validateForm()) {
      // Add your password reset logic here
      console.log('Password reset request for:', email);
      Alert.alert(
        'Success',
        'Password reset instructions sent to your email!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    }
  };

  return (
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
          <Text style={styles.headerTitle}>Reset Password</Text>
          <Text style={styles.headerSubtitle}>
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>
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

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}>
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
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
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 12,
  },
  resetButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgetPasswordScreen;
