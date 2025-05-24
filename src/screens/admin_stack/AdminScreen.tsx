import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {collection, onSnapshot} from 'firebase/firestore';
import {db} from '../../firebase/config';
import {addNewCourse, updateCourse} from '../../firebase/api';
import {AdminStackParamList} from '../../navigation/AdminStack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {Course} from '../../types';
import DashboardTab from '../../components/admin/tabs/DashboardTab';
import CoursesTab from '../../components/admin/tabs/CoursesTab';
import UsersTab from '../../components/admin/tabs/UsersTab';
import SettingsTab from '../../components/admin/tabs/SettingsTab';

type Props = NativeStackScreenProps<
  AdminStackParamList & RootStackParamList,
  'Admin'
>;

const AdminScreen = ({navigation}: Props) => {
  // State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'courses' | 'users' | 'settings'
  >('dashboard');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [newCourseTitle, setNewCourseTitle] = useState<string>('');
  const [newCourseCode, setNewCourseCode] = useState<string>('');
  const [newCourseYear, setNewCourseYear] = useState<string>('First Year');
  const [newCourseSemester, setNewCourseSemester] =
    useState<string>('First Semester');
  const [loading, setLoading] = useState<boolean>(false);

  // Sample data
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const collectionRef = collection(db, 'courses');
    const unsubscribe = onSnapshot(collectionRef, QuerySnapshot => {
      const coursesArr = QuerySnapshot.docs.map(doc => ({
        ...doc.data(),
      })) as Course[];

      setCourses(coursesArr);
    });

    return unsubscribe;
  }, []);

  // Handle adding a new course
  const handleAddCourse = async () => {
    setLoading(true);
    if (!newCourseTitle.trim() || !newCourseCode.trim()) {
      Alert.alert('Error', 'Please fill in all the required fields');
      return;
    }

    const newCourse: Course = {
      id: newCourseCode,
      code: newCourseCode,
      title: newCourseTitle,
      students: 0,
      materials: 0,
      image: 'https://via.placeholder.com/60',
      academicYear: newCourseYear,
      semester: newCourseSemester,
    };

    await addNewCourse(newCourse);

    setCourses([...(courses ?? []), newCourse]);
    setNewCourseTitle('');
    setNewCourseCode('');
    setNewCourseYear('first_year');
    setNewCourseSemester('first_semester');
    setModalVisible(false);
    setLoading(false);
  };

  // Handle editing a course
  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setNewCourseTitle(course.title);
    setNewCourseCode(course.code);
    setNewCourseYear(course.academicYear);
    setNewCourseSemester(course.semester);
    setModalVisible(true);
  };

  // Handle updating a course
  const handleUpdateCourse = async () => {
    if (!currentCourse) return;

    if (!newCourseTitle.trim() || !newCourseCode.trim()) {
      Alert.alert('Error', 'Please fill in all the required fields');
      return;
    }

    const updatedCourses = (courses ?? []).map(course =>
      course.id === currentCourse.id
        ? {
            ...course,
            title: newCourseTitle,
            code: newCourseCode,
            academicYear: newCourseYear,
            semester: newCourseSemester,
          }
        : course,
    );

    await updateCourse({
      id: currentCourse.id,
      title: newCourseTitle,
      code: newCourseCode,
      academicYear: newCourseYear,
      semester: newCourseSemester,
    });

    setCourses(updatedCourses);
    setNewCourseTitle('');
    setNewCourseCode('');
    setNewCourseYear('first_year');
    setNewCourseSemester('first_semester');
    setCurrentCourse(null);
    setModalVisible(false);
  };

  // Render dashboard content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab courses={courses} />;
      case 'courses':
        return (
          <CoursesTab
            courses={courses}
            handleEditCourse={handleEditCourse}
            setCourses={setCourses}
            setCurrentCourse={setCurrentCourse}
            setModalVisible={setModalVisible}
            setNewCourseTitle={setNewCourseTitle}
            setNewCourseCode={setNewCourseCode}
          />
        );
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Auth', {screen: 'Login'})}>
          <Icon name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {['dashboard', 'courses', 'users', 'settings'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.navItem, activeTab === tab && styles.activeNavItem]}
            onPress={() => setActiveTab(tab as any)}>
            <Text
              style={[
                styles.navText,
                activeTab === tab && styles.activeNavText,
              ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>{renderContent()}</View>

      {/* Course Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentCourse ? 'Edit Course' : 'Add New Course'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Course Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. ICT2113"
                  value={newCourseCode}
                  onChangeText={setNewCourseCode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Course Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Database Management Systems"
                  value={newCourseTitle}
                  onChangeText={setNewCourseTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Academic Year</Text>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                      Alert.alert('Select Academic Year', '', [
                        {
                          text: 'First Year',
                          onPress: () => setNewCourseYear('first_year'),
                        },
                        {
                          text: 'Second Year',
                          onPress: () => setNewCourseYear('second_year'),
                        },
                        {
                          text: 'Third Year',
                          onPress: () => setNewCourseYear('third_year'),
                        },
                        {
                          text: 'Fourth Year',
                          onPress: () => setNewCourseYear('fourth_year'),
                        },
                        {text: 'Cancel', style: 'cancel'},
                      ]);
                    }}>
                    <Text style={styles.dropdownText}>{newCourseYear}</Text>
                    <Icon name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Semester</Text>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                      Alert.alert('Select Semester', '', [
                        {
                          text: 'First Semester',
                          onPress: () => setNewCourseSemester('first_semester'),
                        },
                        {
                          text: 'Second Semester',
                          onPress: () =>
                            setNewCourseSemester('second_semester'),
                        },
                        {text: 'Cancel', style: 'cancel'},
                      ]);
                    }}>
                    <Text style={styles.dropdownText}>{newCourseSemester}</Text>
                    <Icon name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={
                    currentCourse ? handleUpdateCourse : handleAddCourse
                  }>
                  <Text style={styles.saveButtonText}>
                    {currentCourse ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2563EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  navItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  navText: {
    fontSize: 14,
    color: '#666',
  },
  activeNavText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  dropdown: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default AdminScreen;
