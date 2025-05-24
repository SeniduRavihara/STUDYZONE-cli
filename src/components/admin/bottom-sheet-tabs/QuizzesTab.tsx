import {deleteQuizes, uploadQuizes} from '../../../firebase/api';
import {Course, Quiz} from '../../../types';
// import * as DocumentPicker from 'expo-document-picker';
// import * as FileSystem from 'expo-file-system';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type QuizzesTabProps = {
  courseId: string;
  selectedCourse: Course;
};

const QuizzesTab: React.FC<QuizzesTabProps> = ({courseId, selectedCourse}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
  } | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestions, setQuizQuestions] = useState('');
  const [step, setStep] = useState(1); // 1 for title, 2 for questions

  useEffect(() => {
    setQuizzes(selectedCourse?.quizzes ?? []);
  }, [selectedCourse]);

  const pickQuiz = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      console.log('Document picked:');

      if (!result.canceled) {
        const {name, uri} = result.assets[0];
        // Store selected file and show modal
        setSelectedFile({uri, name});
        setQuizTitle('');
        setQuizQuestions('');
        setStep(1);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleModalSubmit = () => {
    if (step === 1) {
      // Validate quiz title
      if (!quizTitle || quizTitle.trim() === '') {
        Alert.alert('Error', 'Quiz title is required');
        return;
      }

      // Move to questions step
      setStep(2);
      return;
    }

    // Handle final submission (step 2)
    if (!selectedFile) return;

    const questionsNum = parseInt(quizQuestions);
    if (isNaN(questionsNum) || questionsNum <= 0) {
      Alert.alert('Error', 'Please enter a valid number of questions');
      return;
    }

    // Close modal and process upload
    setModalVisible(false);
    uploadPDF(
      selectedFile.uri,
      selectedFile.name,
      quizTitle.trim(),
      questionsNum,
    );
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedFile(null);
  };

  const uploadPDF = async (
    uri: string,
    fileName: string,
    title: string,
    questions: number,
  ) => {
    try {
      setUploading(true);

      // Get file info to determine size
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSizeInBytes =
        fileInfo.exists &&
        'size' in fileInfo &&
        typeof fileInfo.size === 'number'
          ? fileInfo.size
          : 0;
      const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

      console.log('File size in bytes:', fileSizeInMB);

      // Create storage reference
      const timestamp = new Date();

      // Convert to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadQuizes(
        blob,
        fileName,
        title,
        courseId,
        fileSizeInMB,
        timestamp,
        questions,
      );
    } catch (error) {
      console.error('Error uploading PDF:', error);
      Alert.alert('Error', 'Failed to upload quiz');
    } finally {
      setUploading(false);
    }
  };

  const deleteQuizFile = async (
    id: string,
    fileName: string,
    title: string,
  ) => {
    Alert.alert('Delete Quiz', `Are you sure you want to delete "${title}"?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);

            await deleteQuizes(fileName, courseId);

            Alert.alert('Success', 'Quiz deleted successfully');
          } catch (error) {
            console.error('Error deleting quiz:', error);
            Alert.alert('Error', 'Failed to delete quiz');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderQuizItem = ({item}: {item: Quiz}) => (
    <View style={styles.quizItem}>
      <View style={styles.quizInfo}>
        <Icon name="help-circle" size={24} color="#2563EB" />
        <View style={styles.quizDetails}>
          <Text style={styles.quizTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.quizMeta}>
            {item.questions} questions • {item.size} •{' '}
            {item.uploadDate
              ? typeof item.uploadDate === 'object' &&
                'seconds' in item.uploadDate
                ? new Date(
                    (item.uploadDate as any).seconds * 1000,
                  ).toLocaleDateString()
                : new Date(item.uploadDate).toLocaleDateString()
              : 'Just now'}
          </Text>
        </View>
      </View>
      <View style={styles.quizActions}>
        <TouchableOpacity
          style={styles.quizAction}
          onPress={() => {
            // Open quiz using linking or a PDF viewer
            Alert.alert('View Quiz', `Opening ${item.title}`);
          }}>
          <Icon name="eye" size={22} color="#2563EB" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quizAction}
          onPress={() => deleteQuizFile(item.id, item.fileName, item.title)}>
          <Icon name="delete" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="help-circle-outline" size={60} color="#2563EB" />
      <Text style={styles.emptyText}>No quizzes available</Text>
      <Text style={styles.emptySubText}>
        Upload quizzes for this course using the button below
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading quizzes...</Text>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={item => item.id}
          renderItem={renderQuizItem}
          ListEmptyComponent={EmptyListComponent}
          style={styles.list}
          contentContainerStyle={quizzes.length === 0 ? {flex: 1} : {}}
        />
      )}

      {/* Quiz Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalCancel}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {step === 1 ? 'Enter Quiz Title' : 'Enter Number of Questions'}
            </Text>

            {step === 1 ? (
              <TextInput
                style={styles.input}
                value={quizTitle}
                onChangeText={setQuizTitle}
                placeholder="Quiz Title"
                autoFocus
              />
            ) : (
              <TextInput
                style={styles.input}
                value={quizQuestions}
                onChangeText={setQuizQuestions}
                placeholder="Number of Questions"
                keyboardType="numeric"
                autoFocus
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleModalCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleModalSubmit}>
                <Text style={styles.buttonText}>
                  {step === 1 ? 'Next' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickQuiz}
        disabled={uploading}>
        {uploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Icon name="plus-circle" size={20} color="#fff" />
            <Text style={styles.uploadButtonText}>Upload Quiz</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  quizItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quizDetails: {
    marginLeft: 12,
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  quizMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quizActions: {
    flexDirection: 'row',
  },
  quizAction: {
    padding: 8,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  submitButton: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default QuizzesTab;
