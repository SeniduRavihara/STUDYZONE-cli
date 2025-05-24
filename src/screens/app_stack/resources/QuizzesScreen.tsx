import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppStackParamList} from '../../../navigation/AppStack';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {Quiz} from '../../../types';

type Props = NativeStackScreenProps<
  AppStackParamList & RootStackParamList,
  'Quizzes'
>;

const QuizzesScreen = ({navigation, route}: Props) => {
  const {quizzes = []} = route.params;
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const handleStartQuiz = async (quiz: Quiz) => {
    console.log('Starting quiz:', quiz.url);
    try {
      setLoading({...loading, [quiz.id]: true});

      // Try to open the URL directly first
      try {
        await Linking.openURL(quiz.url);
        return;
      } catch (directError) {
        console.log('Direct URL failed, trying formatted URL...');
      }

      // If direct fails, try with formatted URL (replace & with %26)
      try {
        const formattedUrl = quiz.url.replace(/&/g, '%26');
        await Linking.openURL(formattedUrl);
        return;
      } catch (formattedError) {
        console.log('Formatted URL failed, trying Google Forms viewer...');
      }

      // If both fail, try Google Forms viewer as fallback
      try {
        const browserUrl = `https://docs.google.com/forms/d/e/${quiz.url}/viewform?embedded=true`;
        await Linking.openURL(browserUrl);
        return;
      } catch (viewerError) {
        console.log('Google Forms viewer failed, trying final attempt...');
      }

      // Final fallback - try opening the original URL without canOpenURL check
      await Linking.openURL(quiz.url);
      Alert.alert('Opening Quiz', 'The quiz will open in your browser.', [
        {text: 'OK'},
      ]);
    } catch (error) {
      console.error('All quiz opening methods failed:', error);
      let errorMessage = 'Failed to open the quiz';

      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage =
            'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Quiz not found. It may have been removed.';
        } else if (
          error.message.includes('403') ||
          error.message.includes('401')
        ) {
          errorMessage =
            'Access denied. You may not have permission to access this quiz.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading({...loading, [quiz.id]: false});
    }
  };

  const renderQuizItem = ({item}: {item: Quiz}) => (
    <View style={styles.quizItem}>
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{item.title}</Text>
        <Text style={styles.quizDetails}>
          Questions: {item.questions} • Size: {item.size}
        </Text>
        <Text style={styles.quizDate}>
          Uploaded: {new Date(item.uploadDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.startButton,
            loading[item.id] && styles.startButtonDisabled,
          ]}
          onPress={() => handleStartQuiz(item)}
          disabled={loading[item.id]}>
          {loading[item.id] ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="download" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quizzes</Text>
      </View>

      {quizzes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="file-question-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No quizzes available</Text>
          <Text style={styles.emptySubtext}>
            Quizzes will appear here once they are added.
          </Text>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          renderItem={renderQuizItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.footerButtonText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.nextButton]}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.footerButtonText}>HOME</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  quizItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quizDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  quizDate: {
    fontSize: 12,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  startButtonDisabled: {
    backgroundColor: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  nextButton: {
    backgroundColor: '#0066cc',
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default QuizzesScreen;
