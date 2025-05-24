import {deleteCourse} from '../../../firebase/api';
import {Course} from '../../../types';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from '../../BottomSheet';


type CoursesTabProps = {
  setCurrentCourse: (course: Course | null) => void;
  setNewCourseTitle: (title: string) => void;
  setNewCourseCode: (code: string) => void;
  setModalVisible: (visible: boolean) => void;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  handleEditCourse: (course: Course) => void;
};

const {height} = Dimensions.get('window');

const CoursesTab: React.FC<CoursesTabProps> = ({
  setCurrentCourse,
  setNewCourseTitle,
  setNewCourseCode,
  setModalVisible,
  courses,
  setCourses,
  handleEditCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Animation values
  const bottomSheetY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedCourse) {
      setSelectedCourse(
        courses.find(course => course.id === selectedCourse.id) ?? null,
      );
    }
  }, [courses, selectedCourse]);

  // Filter courses based on search query
  const filteredCourses = (courses ?? []).filter(
    course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle deleting a course
  const handleDeleteCourse = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this course?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            deleteCourse(id);
            const updatedCourses = (courses ?? []).filter(
              course => course.id !== id,
            );
            setCourses(updatedCourses);
          },
        },
      ],
    );
  };

  // Open bottom sheet with course details
  const openBottomSheet = (course: Course) => {
    setSelectedCourse(course);

    // Reset animation values before opening
    bottomSheetY.setValue(height);
    backdropOpacity.setValue(0);

    setOpenSheet(true);
  };

  // This effect handles animation after the openSheet state is updated
  useEffect(() => {
    if (openSheet) {
      // Start animations after the modal is visible
      Animated.parallel([
        Animated.timing(bottomSheetY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [backdropOpacity, bottomSheetY, openSheet]);

  // Close bottom sheet
  const closeBottomSheet = () => {
    // Start animations
    Animated.parallel([
      Animated.timing(bottomSheetY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOpenSheet(false);
      setSelectedCourse(null);
    });
  };

  // Render course item
  const renderCourseItem = ({item}: {item: Course}) => (
    <View style={styles.courseItem}>
      <Image source={{uri: item.image}} style={styles.courseImage} />
      <View style={styles.courseDetails}>
        <Text style={styles.courseCode}>{item.code}</Text>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <View style={styles.courseStats}>
          <Text style={styles.courseStat}>{item.students} Students</Text>
          <Text style={styles.courseStat}>{item.materials} Materials</Text>
        </View>
        <View style={styles.courseTags}>
          <View style={styles.courseTag}>
            <Text style={styles.courseTagText}>{item.academicYear}</Text>
          </View>
          <View style={[styles.courseTag, {backgroundColor: '#E3F2FD'}]}>
            <Text style={[styles.courseTagText, {color: '#2196F3'}]}>
              {item.semester}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.courseActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditCourse(item)}>
          <Icon name="pencil" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openBottomSheet(item)}>
          <Icon name="folder-open" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteCourse(item.id)}>
          <Icon name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.content}>
      <View style={styles.headerActions}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setCurrentCourse(null);
            setNewCourseTitle('');
            setNewCourseCode('');
            setModalVisible(true);
          }}>
          <Icon name="plus" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Course</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.coursesList}
        showsVerticalScrollIndicator={false}
      />

      {selectedCourse && (
        <BottomSheet
          backdropOpacity={backdropOpacity}
          bottomSheetY={bottomSheetY}
          closeBottomSheet={closeBottomSheet}
          handleDeleteCourse={handleDeleteCourse}
          handleEditCourse={handleEditCourse}
          openSheet={openSheet}
          selectedCourse={selectedCourse}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 5,
  },
  coursesList: {
    paddingBottom: 20,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  courseDetails: {
    flex: 1,
    paddingHorizontal: 15,
  },
  courseCode: {
    fontSize: 14,
    color: '#666',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 2,
  },
  courseStats: {
    flexDirection: 'row',
    marginTop: 6,
  },
  courseStat: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  courseTags: {
    flexDirection: 'row',
    marginTop: 6,
  },
  courseTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  courseTagText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  courseActions: {
    flexDirection: 'column',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
});

export default CoursesTab;
