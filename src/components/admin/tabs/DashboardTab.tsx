import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Course} from '../../../types';

type DashboardTabProps = {
  courses: Course[];
};

const DashboardTab = ({courses}: DashboardTabProps) => {
  // Stats for dashboard
  const totalStudents = (courses ?? []).reduce(
    (sum, course) => sum + (course.students ?? 0),
    0,
  );
  const totalMaterials = (courses ?? []).reduce(
    (sum, course) => sum + (course.materials ?? 0),
    0,
  );

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, {backgroundColor: '#E3F2FD'}]}>
          <Icon name="book" size={24} color="#2196F3" />
          <Text style={styles.statNumber}>{courses ? courses.length : 0}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#E8F5E9'}]}>
          <Icon name="account-group" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>{totalStudents}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#FFF3E0'}]}>
          <Icon name="file-document" size={24} color="#FF9800" />
          <Text style={styles.statNumber}>{totalMaterials}</Text>
          <Text style={styles.statLabel}>Materials</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Courses</Text>
      {(courses ?? []).slice(0, 3).map(course => (
        <View key={course.id} style={styles.recentCourse}>
          <Image
            source={{uri: course.image}}
            style={styles.recentCourseImage}
          />
          <View style={styles.recentCourseDetails}>
            <Text style={styles.recentCourseCode}>{course.code}</Text>
            <Text style={styles.recentCourseTitle}>{course.title}</Text>
          </View>
          <Text style={styles.recentCourseStudents}>
            {course.students} Students
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recentCourse: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentCourseImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  recentCourseDetails: {
    flex: 1,
    paddingHorizontal: 15,
  },
  recentCourseCode: {
    fontSize: 12,
    color: '#666',
  },
  recentCourseTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  recentCourseStudents: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default DashboardTab;
