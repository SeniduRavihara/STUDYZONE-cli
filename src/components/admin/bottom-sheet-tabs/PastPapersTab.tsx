import {deletePP, uploadPP} from '../../../firebase/api';
import {Course, PastPaper} from '../../../types';
// import * as DocumentPicker from 'expo-document-picker';
// import * as FileSystem from 'expo-file-system';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type PastPapersTabProps = {
  courseId: string;
  selectedCourse: Course;
};

const PastPapersTab: React.FC<PastPapersTabProps> = ({
  courseId,
  selectedCourse,
}) => {
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPastPapers(selectedCourse?.pastPapers ?? []);
  }, [selectedCourse]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      console.log('Document picked:');

      if (!result.canceled) {
        const {name, uri} = result.assets[0];

        console.log('Document URI:', uri);
        uploadPDF(uri, name);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadPDF = async (uri: string, name: string) => {
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

      await uploadPP(blob, name, courseId, fileSizeInMB, timestamp);

      // Add document to Firestore
    } catch (error) {
      console.error('Error uploading PDF:', error);
      Alert.alert('Error', 'Failed to upload PDF');
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  const deletePastPaper = async (id: string, fileName: string) => {
    Alert.alert(
      'Delete Past Paper',
      `Are you sure you want to delete ${fileName}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              await deletePP(fileName, courseId);

              Alert.alert('Success', 'Past paper deleted successfully');
            } catch (error) {
              console.error('Error deleting past paper:', error);
              Alert.alert('Error', 'Failed to delete past paper');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const renderPastPaperItem = ({item}: {item: PastPaper}) => (
    <View style={styles.paperItem}>
      <View style={styles.paperInfo}>
        <Icon name="file-document" size={24} color="#2563EB" />
        <View style={styles.paperDetails}>
          <Text style={styles.paperName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.paperMeta}>
            {item.size} •{' '}
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
      <View style={styles.paperActions}>
        <TouchableOpacity
          style={styles.paperAction}
          onPress={() => {
            // Open PDF using linking or a PDF viewer
            // This is a placeholder for PDF viewing functionality
            Alert.alert('View PDF', `Opening ${item.name}`);
          }}>
          <Icon name="eye" size={22} color="#2563EB" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paperAction}
          onPress={() => deletePastPaper(item.id, item.name)}>
          <Icon name="delete" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="file-document-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>No past papers available</Text>
      <Text style={styles.emptySubText}>
        Upload past papers for this course using the button below
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading past papers...</Text>
        </View>
      ) : (
        <FlatList
          data={pastPapers}
          keyExtractor={item => item.id}
          renderItem={renderPastPaperItem}
          ListEmptyComponent={EmptyListComponent}
          style={styles.list}
          contentContainerStyle={pastPapers.length === 0 ? {flex: 1} : {}}
        />
      )}

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickDocument}
        disabled={uploading}>
        {uploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Icon name="cloud-upload" size={20} color="#fff" />
            <Text style={styles.uploadButtonText}>Upload Past Paper</Text>
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
  paperItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paperDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paperName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  paperMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  paperActions: {
    flexDirection: 'row',
  },
  paperAction: {
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
});

export default PastPapersTab;
