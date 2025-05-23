// HomeScreen.tsx
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Image,
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
import {useAuth} from '../../hooks/useAuth';
import {AppStackParamList} from '../../navigation/AppStack';
import {RootStackParamList} from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  AppStackParamList & RootStackParamList,
  'Home'
>;

// TypeScript interfaces
interface CourseData {
  id: string;
  title: string;
  subtitle: string;
  isFavorite: boolean;
  image?: string;
}

interface FavoriteState {
  [key: string]: boolean;
}

const HomeScreen = ({navigation}: Props) => {
  const {currentUser} = useAuth();

  // Sample course data
  const [courses] = useState<CourseData[]>([
    {
      id: 'ICT3133',
      title: 'ICT3133-Mobile',
      subtitle: 'Application Development',
      isFavorite: false,
      image: undefined,
    },
    {
      id: 'ICT3123',
      title: 'ICT3123-Software',
      subtitle: 'Project Management',
      isFavorite: false,
      image: undefined,
    },
    {
      id: 'ICT3143',
      title: 'ICT3143-Data Analytics',
      subtitle: 'and Big Data',
      isFavorite: true,
      image: undefined,
    },
  ]);

  const [favorites, setFavorites] = useState<FavoriteState>({
    ICT3133: false,
    ICT3123: false,
    ICT3143: true,
  });

  // Check if the user is logged in, if not, redirect to login screen
  useEffect(() => {
    if (!currentUser) {
      navigation.navigate('Auth', {
        screen: 'Login',
      });
    }

    if (currentUser?.isAdmin) {
      navigation.navigate('Admin');
    }
  }, [currentUser, navigation]);

  const toggleFavorite = (courseId: string): void => {
    setFavorites(prev => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const handleViewCourse = (courseId: string): void => {
    console.log(`Viewing course ${courseId}`);
    // navigation.navigate('CourseDetail', { courseId });
  };

  const handleNext = (): void => {
    // Since SelectYear is not in the navigation stack, we'll navigate to Home for now
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#2563EB" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon
            name="account"
            size={20}
            color="white"
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>STUDY ZONE</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon
            name="magnify"
            size={20}
            color="white"
            style={styles.headerIcon}
          />
          <Icon name="menu" size={20} color="white" />
        </View>
      </View>

      {/* Banner area */}
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../assets/images/in-app/study.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerIndicator} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Navigation Tabs */}
        <Text style={styles.homeText}>Home</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.tabButtonText}>Subjects</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.tabButtonText}>Semester</Text>
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Icon
              name="magnify"
              size={14}
              color="gray"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search here"
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.imageButton}>
            <Icon name="image-outline" size={16} color="black" />
          </TouchableOpacity>
        </View>

        {/* Course List */}
        <ScrollView style={styles.courseList}>
          {courses.map(course => (
            <View key={course.id} style={styles.courseItem}>
              <View style={styles.courseDetails}>
                <View style={styles.courseHeader}>
                  <View>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
                  </View>

                  <TouchableOpacity onPress={() => toggleFavorite(course.id)}>
                    <Icon
                      name={favorites[course.id] ? 'heart' : 'heart-outline'}
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewCourse(course.id)}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>NEXT</Text>
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
  header: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
  },
  bannerContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  bannerImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  bannerIndicator: {
    width: 60,
    height: 4,
    backgroundColor: '#2563EB',
    marginTop: 16,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  homeText: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 24,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  tabButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  tabButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    maxWidth: 160,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 8,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingLeft: 36,
    paddingRight: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  imageButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseList: {
    flex: 1,
  },
  courseItem: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  courseDetails: {
    flex: 1,
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseTitle: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  courseSubtitle: {
    color: '#6B7280',
    fontSize: 14,
  },
  viewButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  nextButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
