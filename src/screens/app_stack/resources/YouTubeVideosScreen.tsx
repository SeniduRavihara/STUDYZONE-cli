import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';
import {getYtVideosForCourse} from '../../../firebase/api';
import {AppStackParamList} from '../../../navigation/AppStack';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {VideoLink} from '../../../types';

type Props = NativeStackScreenProps<
  AppStackParamList & RootStackParamList,
  'YouTubeVideos'
>;

const {width} = Dimensions.get('window');

const YouTubeVideosScreen = ({navigation, route}: Props) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoLink | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [videos, setVideos] = useState<VideoLink[]>([]);
  const [loading, setLoading] = useState(true);

  const {subject, subjectCode, subjectName} = route.params;

  useEffect(() => {
    const fetchVideos = async () => {
      if (!subjectCode) {
        setLoading(false);
        return;
      }

      try {
        const fetchedVideos = await getYtVideosForCourse(subjectCode);
        setVideos(fetchedVideos || []); // Use empty array as fallback
        setLoading(false);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchVideos();
  }, [subjectCode]);

  const playVideo = (video: VideoLink) => {
    setSelectedVideo(video);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVideo(null);
  };

  const renderVideoItem = ({item}: {item: VideoLink}) => (
    <TouchableOpacity style={styles.videoItem} onPress={() => playVideo(item)}>
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnailPlaceholder}>
          <Icon name="youtube" size={36} color="red" />
        </View>
        <View style={styles.playIcon}>
          <Icon name="play-circle" size={32} color="white" />
        </View>
      </View>

      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Fallback to sample data if no videos are returned from API
  const displayedVideos = videos.length > 0 ? videos : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Tutorials</Text>
      </View>

      <Text style={styles.subtitle}>
        {subjectCode} - {subjectName || subject || 'Course Videos'}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      ) : displayedVideos.length > 0 ? (
        <FlatList
          data={displayedVideos}
          renderItem={renderVideoItem}
          keyExtractor={item => item.videoId || String(Math.random())}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="video-off-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            No video tutorials available for this course yet.
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.videoPlayerHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Icon name="close" size={28} color="black" />
            </TouchableOpacity>
            {selectedVideo && (
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedVideo.title}
              </Text>
            )}
          </View>

          {selectedVideo && (
            <WebView
              style={styles.videoPlayer}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              source={{
                uri: `https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`,
              }}
              allowsFullscreenVideo={true}
            />
          )}
        </View>
      </Modal>

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
  subtitle: {
    fontSize: 16,
    color: '#555',
    margin: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  videoItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  thumbnailContainer: {
    position: 'relative',
    width: 120,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
  },
  videoInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoPlayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  videoPlayer: {
    width: width,
    height: width * 0.5625, // 16:9 aspect ratio
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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

export default YouTubeVideosScreen;
