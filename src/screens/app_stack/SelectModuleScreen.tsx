import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getCoursesForYearAndSemester} from '../../firebase/api';
import {AppStackParamList} from '../../navigation/AppStack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {Course} from '../../types';

type Props = NativeStackScreenProps<
  AppStackParamList & RootStackParamList,
  'SelectModule'
>;

const SelectModuleScreen = ({navigation, route}: Props) => {
  const {academicYear, semester} = route.params;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Selected subject state
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        if (academicYear && semester) {
          const fetchedData = await getCoursesForYearAndSemester(
            academicYear,
            semester,
          );
          setCourses(fetchedData);
        } else {
          // Handle missing parameters, e.g., show an error or skip fetching
          console.warn('academicYear or semester is undefined');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [academicYear, semester]);

  // Handle option selection
  const handleSelectSubject = (subjectId: string): void => {
    setSelectedSubject(subjectId);
  };

  // Navigate back
  const handleBack = (): void => {
    navigation.goBack();
  };

  // Navigate to next screen
  const handleNext = (): void => {
    if (selectedSubject) {
      const selected = courses.find(course => course.id === selectedSubject);

      // navigation.navigate('Topics', {
      //   academicYear,
      //   semester,
      //   subject: selectedSubject,
      //   subjectCode: selected?.code,
      //   subjectName: selected?.title,
      // });
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
      <Text style={styles.headerTitle}>Select your Subject</Text>

      {/* Subjects List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.optionsContainer}
          showsVerticalScrollIndicator={false}>
          {courses.map(subject => (
            <TouchableOpacity
              key={subject.id}
              style={[
                styles.subjectOption,
                selectedSubject === subject.id && styles.selectedSubjectOption,
              ]}
              onPress={() => handleSelectSubject(subject.id)}>
              <Text
                style={[
                  styles.subjectCode,
                  selectedSubject === subject.id && styles.selectedSubjectText,
                ]}>
                {subject.code}
              </Text>
              <Text
                style={[
                  styles.subjectName,
                  selectedSubject === subject.id && styles.selectedSubjectText,
                ]}>
                {subject.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.backActionButton} onPress={handleBack}>
          <Text style={styles.backActionButtonText}>BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            (!selectedSubject || loading) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedSubject || loading}>
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
  scrollContainer: {
    width: '100%',
    flex: 1,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  subjectOption: {
    backgroundColor: '#F9FAFB',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedSubjectOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  subjectCode: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subjectName: {
    color: '#6B7280',
    fontSize: 14,
  },
  selectedSubjectText: {
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

export default SelectModuleScreen;
