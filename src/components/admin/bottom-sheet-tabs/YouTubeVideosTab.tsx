import {addYtVideo, deleteYtVideo} from '../../../firebase/api';
import {Course, VideoLink} from '../../../types';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type YouTubeVideosTabProps = {
  courseId: string;
  selectedCourse: Course;
};

const YouTubeVideosTab: React.FC<YouTubeVideosTabProps> = ({
  courseId,
  selectedCourse,
}) => {
  const [videos, setVideos] = useState<VideoLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [addingVideo, setAddingVideo] = useState(false);

  useEffect(() => {
    setVideos(selectedCourse?.videos ?? []);
  }, [selectedCourse]);

  const getYouTubeVideoId = (url: string): string | null => {
    // Regular expressions to extract YouTube video ID from different URL formats
    const regexps = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/embed\/|youtube\.com\/user\/[^/]+\/\w{1}\/|youtube\.com\/attribution_link\?a=.*?&u=\/watch\?v=|youtube\.com\/attribution_link\?a=.*?&u=%2Fwatch%3Fv%3D|youtube\.com\/shorts\/)([^#&?/\s]{11})/,
      /(?:youtube\.com\/\w+\/\w+\/[^#&?/\s]{11})/,
    ];

    for (const regex of regexps) {
      const match = url.match(regex);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const addVideo = async () => {
    // Basic validation
    if (!videoTitle.trim()) {
      Alert.alert('Error', 'Please enter a video title');
      return;
    }

    if (!videoUrl.trim()) {
      Alert.alert('Error', 'Please enter a video URL');
      return;
    }

    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) {
      Alert.alert(
        'Error',
        'Invalid YouTube URL. Please enter a valid YouTube video URL',
      );
      return;
    }

    try {
      setAddingVideo(true);

      // Generate thumbnail URL
      const thumbnailUrl = getYouTubeThumbnail(videoId);

      await addYtVideo(
        courseId,
        videoTitle,
        videoUrl,
        thumbnailUrl,
        videoId,
        new Date(),
      );

      // Reset form and close modal
      setVideoTitle('');
      setVideoUrl('');
      setModalVisible(false);

      Alert.alert('Success', 'YouTube video added successfully');
    } catch (error) {
      console.error('Error adding video:', error);
      Alert.alert('Error', 'Failed to add YouTube video');
    } finally {
      setAddingVideo(false);
    }
  };

  const deleteVideo = (id: string, title: string) => {
    Alert.alert('Delete Video', `Are you sure you want to remove "${title}"?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);

            await deleteYtVideo(courseId, id);

            Alert.alert('Success', 'Video removed successfully');
          } catch (error) {
            console.error('Error deleting video:', error);
            Alert.alert('Error', 'Failed to delete video');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderVideoItem = ({item}: {item: VideoLink}) => (
    <View style={styles.videoItem}>
      <View style={styles.videoThumbnail}>
        {/* Placeholder for video thumbnail - in a real app, you'd display the actual thumbnail */}
        <View style={styles.thumbnailPlaceholder}>
          <Icon name="youtube" size={30} color="#FF0000" />
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoMeta}>
          Added:{' '}
          {item.addedOn
            ? new Date(item.addedOn.seconds * 1000).toLocaleDateString()
            : 'Just now'}
        </Text>
      </View>
      <View style={styles.videoActions}>
        <TouchableOpacity
          style={styles.videoAction}
          onPress={() => {
            // Open video - in a real app, you'd use Linking or a WebView
            Alert.alert('Open Video', `Opening "${item.title}"`);
          }}>
          <Icon name="play-circle" size={24} color="#2563EB" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.videoAction}
          onPress={() => deleteVideo(item.videoId, item.title)}>
          <Icon name="delete" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="youtube" size={60} color="#FF0000" />
      <Text style={styles.emptyText}>No YouTube videos available</Text>
      <Text style={styles.emptySubText}>
        Add YouTube video links for this course using the button below
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={item => item.videoId}
          renderItem={renderVideoItem}
          ListEmptyComponent={EmptyListComponent}
          style={styles.list}
          contentContainerStyle={videos.length === 0 ? {flex: 1} : {}}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Icon name="plus-circle" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add YouTube Video</Text>
      </TouchableOpacity>

      {/* Add Video Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add YouTube Video</Text>

              <Text style={styles.inputLabel}>Video Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter video title"
                value={videoTitle}
                onChangeText={setVideoTitle}
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>YouTube URL</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter YouTube video URL"
                value={videoUrl}
                onChangeText={setVideoUrl}
                autoCapitalize="none"
                keyboardType="url"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setModalVisible(false);
                    setVideoTitle('');
                    setVideoUrl('');
                  }}
                  disabled={addingVideo}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={addVideo}
                  disabled={addingVideo}>
                  {addingVideo ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Add Video</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  videoItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  videoInfo: {
    marginLeft: 12,
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  videoMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  videoActions: {
    flexDirection: 'row',
  },
  videoAction: {
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
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default YouTubeVideosTab;
