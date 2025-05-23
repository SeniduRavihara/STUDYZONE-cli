import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppStackParamList} from '../../navigation/AppStack';
import {RootStackParamList} from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  AppStackParamList & RootStackParamList,
  'SelectStudyMaterial'
>;

type ResourceOption = {
  id: string;
  title: string;
  icon: string;
  value: string;
};

const SelectStudyMaterialScreen = ({navigation, route}: Props) => {
  const {
    academicYear,
    semester,
    subject,
    subjectCode,
    subjectName,
    pastPapers,
    quizzes,
    videos,
  } = route.params;

  // Resource options
  const resourceOptions: ResourceOption[] = [
    {id: '1', title: 'Past Papers', icon: '📄', value: 'past-papers'},
    {id: '2', title: 'YouTube Videos', icon: '▶️', value: 'youtube-videos'},
    {id: '3', title: 'Quizzes', icon: '📝', value: 'quizzes'},
  ];

  // Selected resource state
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  // Handle option selection
  const handleSelectResource = (value: string): void => {
    setSelectedResource(value);
  };

  // Navigate back
  const handleBack = (): void => {
    navigation.goBack();
  };

  // Navigate to next screen
  const handleNext = (): void => {
    if (selectedResource) {
      const baseParams = {
        academicYear,
        semester,
        subject,
        subjectCode,
        subjectName,
      };

      switch (selectedResource) {
        case 'past-papers':
          navigation.navigate('PastPapers', {
            ...baseParams,
            resourceType: 'past-papers' as const,
            pastPapers: pastPapers || [],
          });
          break;
        case 'youtube-videos':
          navigation.navigate('YouTubeVideos', {
            ...baseParams,
            resourceType: 'youtube-videos' as const,
            videos: videos || [],
          });
          break;
        case 'quizzes':
          navigation.navigate('Quizzes', {
            ...baseParams,
            resourceType: 'quizzes' as const,
            quizzes: quizzes || [],
          });
          break;
      }
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

      {/* Subject Title */}
      <Text style={styles.subjectTitle}>
        {subjectCode} - {subjectName}
      </Text>

      {/* Resource Options */}
      <View style={styles.optionsContainer}>
        {resourceOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.resourceOption,
              selectedResource === option.value &&
                styles.selectedResourceOption,
            ]}
            onPress={() => handleSelectResource(option.value)}>
            <Text style={styles.resourceIcon}>{option.icon}</Text>
            <Text
              style={[
                styles.resourceTitle,
                selectedResource === option.value &&
                  styles.selectedResourceText,
              ]}>
              {option.title}
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
            !selectedResource && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedResource}>
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
  subjectTitle: {
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
  resourceOption: {
    backgroundColor: '#F9FAFB',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedResourceOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  resourceIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  resourceTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedResourceText: {
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

export default SelectStudyMaterialScreen;
