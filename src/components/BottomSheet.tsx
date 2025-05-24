import {Course} from '../types';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PastPapersTab from './admin/bottom-sheet-tabs/PastPapersTab';
import QuizzesTab from './admin/bottom-sheet-tabs/QuizzesTab';
import YouTubeVideosTab from './admin/bottom-sheet-tabs/YouTubeVideosTab';

const {height} = Dimensions.get('window');

type BottomSheetProps = {
  openSheet: boolean;
  closeBottomSheet: () => void;
  selectedCourse: Course;
  handleEditCourse: (course: Course) => void;
  handleDeleteCourse: (id: string) => void;
  bottomSheetY: Animated.Value;
  backdropOpacity: Animated.Value;
};

type TabType = 'pastPapers' | 'youtubeVideos' | 'quizzes';

const BottomSheet: React.FC<BottomSheetProps> = ({
  openSheet,
  closeBottomSheet,
  selectedCourse,
  handleEditCourse,
  handleDeleteCourse,
  bottomSheetY,
  backdropOpacity,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('pastPapers');

  // Use effect to ensure modal is only visible after animation is prepared
  useEffect(() => {
    if (!openSheet) {
      // Reset position when closed
      bottomSheetY.setValue(height);
      backdropOpacity.setValue(0);
    }
  }, [backdropOpacity, bottomSheetY, openSheet]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pastPapers':
        return (
          <PastPapersTab
            courseId={selectedCourse.id}
            selectedCourse={selectedCourse}
          />
        );
      case 'youtubeVideos':
        return (
          <YouTubeVideosTab
            selectedCourse={selectedCourse}
            courseId={selectedCourse.id}
          />
        );
      case 'quizzes':
        return (
          <QuizzesTab
            selectedCourse={selectedCourse}
            courseId={selectedCourse.id}
          />
        );
      default:
        return (
          <PastPapersTab
            selectedCourse={selectedCourse}
            courseId={selectedCourse.id}
          />
        );
    }
  };

  if (!openSheet) return null;

  return (
    <Modal
      visible={openSheet}
      transparent={true}
      animationType="none"
      onRequestClose={closeBottomSheet}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <Animated.View
            style={[styles.backdrop, {opacity: backdropOpacity}]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{translateY: bottomSheetY}],
            },
          ]}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetIndicator} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeBottomSheet}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.courseHeaderSection}>
            <Image
              source={{uri: selectedCourse.image}}
              style={styles.detailCourseImage}
            />
            <View style={styles.detailCourseInfo}>
              <Text style={styles.detailCourseCode}>{selectedCourse.code}</Text>
              <Text style={styles.detailCourseTitle}>
                {selectedCourse.title}
              </Text>
            </View>
          </View>

          {/* Tabs Navigation */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'pastPapers' && styles.activeTabItem,
              ]}
              onPress={() => setActiveTab('pastPapers')}>
              <Icon
                name="file-document"
                size={20}
                color={activeTab === 'pastPapers' ? '#2563EB' : '#666'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'pastPapers' && styles.activeTabText,
                ]}>
                Past Papers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'youtubeVideos' && styles.activeTabItem,
              ]}
              onPress={() => setActiveTab('youtubeVideos')}>
              <Icon
                name="youtube"
                size={20}
                color={activeTab === 'youtubeVideos' ? '#2563EB' : '#666'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'youtubeVideos' && styles.activeTabText,
                ]}>
                YouTube Videos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'quizzes' && styles.activeTabItem,
              ]}
              onPress={() => setActiveTab('quizzes')}>
              <Icon
                name="help-circle"
                size={20}
                color={activeTab === 'quizzes' ? '#2563EB' : '#666'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'quizzes' && styles.activeTabText,
                ]}>
                Quizzes
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>{renderTabContent()}</View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.detailActionButton}
              onPress={() => {
                closeBottomSheet();
                handleEditCourse(selectedCourse);
              }}>
              <Icon name="pencil" size={24} color="#2563EB" />
              <Text style={styles.detailActionText}>Edit Course</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.detailActionButton, styles.deleteButton]}
              onPress={() => {
                closeBottomSheet();
                handleDeleteCourse(selectedCourse.id);
              }}>
              <Icon name="delete" size={24} color="#F44336" />
              <Text style={[styles.detailActionText, styles.deleteText]}>
                Delete Course
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.4,
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  bottomSheetHeader: {
    paddingTop: 10,
    paddingBottom: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  bottomSheetIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  courseHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  detailCourseImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  detailCourseInfo: {
    marginLeft: 15,
    flex: 1,
  },
  detailCourseCode: {
    fontSize: 16,
    color: '#666',
  },
  detailCourseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#2563EB',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    marginRight: 0,
  },
  detailActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  deleteText: {
    color: '#F44336',
  },
});

export default BottomSheet;
