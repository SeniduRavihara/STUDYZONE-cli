import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppStackParamList} from '../../navigation/AppStack';
import {RootStackParamList} from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  AppStackParamList & RootStackParamList,
  'SelectYear'
>;

type YearOption = {
  id: number;
  label: string;
  value: string;
};

const SelectYearScreen = ({navigation}: Props) => {
  // Available year options
  const yearOptions: YearOption[] = [
    {id: 1, label: 'First Year', value: 'first_year'},
    {id: 2, label: 'Second Year', value: 'second_year'},
    {id: 3, label: 'Third Year', value: 'third_year'},
    {id: 4, label: 'Fourth Year', value: 'fourth_year'},
  ];

  // Selected year state
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Handle option selection
  const handleSelectYear = (value: string): void => {
    setSelectedYear(value);
  };

  // Navigate back
  const handleBack = (): void => {
    navigation.goBack();
  };

  // Navigate to next screen
  const handleNext = (): void => {
    if (selectedYear) {
      navigation.navigate('SelectSemester', {academicYear: selectedYear});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="chevron-left" size={30} color="#1F2937" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Header */}
      <Text style={styles.headerTitle}>Select your Academic Year</Text>

      {/* Year Options */}
      <View style={styles.optionsContainer}>
        {yearOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.yearOption,
              selectedYear === option.value && styles.selectedYearOption,
            ]}
            onPress={() => handleSelectYear(option.value)}>
            <Text
              style={[
                styles.yearOptionText,
                selectedYear === option.value && styles.selectedYearOptionText,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.backActionButton} onPress={handleBack}>
          <Text style={styles.backActionButtonText}>BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedYear && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedYear}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    height: 64,
    width: 64,
    marginTop: 22,
    borderRadius: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  yearOption: {
    backgroundColor: '#F9FAFB',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedYearOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  yearOptionText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedYearOptionText: {
    color: '#fff',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto',
    marginBottom: 20,
  },
  backActionButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backActionButtonText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SelectYearScreen;
