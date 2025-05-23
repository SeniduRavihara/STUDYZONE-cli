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
import {PastPaper} from '../../../types';

type Props = NativeStackScreenProps<
  AppStackParamList & RootStackParamList,
  'PastPapers'
>;

const PastPapersScreen = ({navigation, route}: Props) => {
  const {pastPapers = []} = route.params;
  const [downloading, setDownloading] = useState<{[key: string]: boolean}>({});

  const handlePreview = async (url: string) => {
    console.log('Preview URL:', url);
    try {
      // For Firebase Storage URLs, we need to ensure they're properly formatted
      const formattedUrl = url.replace(/&/g, '%26');
      const supported = await Linking.canOpenURL(formattedUrl);

      if (supported) {
        await Linking.openURL(formattedUrl);
      } else {
        // If direct opening fails, try opening in browser
        const browserUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
          url,
        )}`;
        const browserSupported = await Linking.canOpenURL(browserUrl);

        if (browserSupported) {
          await Linking.openURL(browserUrl);
        } else {
          throw new Error('Cannot open this file type');
        }
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert(
        'Error',
        'Failed to open the file. Please try downloading it instead.',
      );
    }
  };

  const handleDownload = async (item: PastPaper) => {
    console.log('Download URL:', item.url);
    try {
      setDownloading({...downloading, [item.id]: true});

      // For Firebase Storage URLs, we need to ensure they're properly formatted
      const formattedUrl = item.url.replace(/&/g, '%26');
      const supported = await Linking.canOpenURL(formattedUrl);

      if (supported) {
        await Linking.openURL(formattedUrl);
        Alert.alert(
          'Opening in Browser',
          'The file will open in your browser where you can download it.',
          [{text: 'OK'}],
        );
      } else {
        // If direct opening fails, try opening in browser
        const browserUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
          item.url,
        )}`;
        const browserSupported = await Linking.canOpenURL(browserUrl);

        if (browserSupported) {
          await Linking.openURL(browserUrl);
          Alert.alert(
            'View in Browser',
            'The file will open in your browser where you can download it.',
            [{text: 'OK'}],
          );
        } else {
          throw new Error('Cannot open this file type');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      let errorMessage = 'Failed to download the file';

      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage =
            'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('404')) {
          errorMessage =
            'File not found. The past paper may have been removed.';
        } else if (
          error.message.includes('403') ||
          error.message.includes('401')
        ) {
          errorMessage =
            'Access denied. You may not have permission to download this file.';
        } else {
          errorMessage = `Download error: ${error.message}`;
        }
      }

      Alert.alert('Download Failed', errorMessage);
    } finally {
      setDownloading({...downloading, [item.id]: false});
    }
  };

  const renderPaperItem = ({item}: {item: PastPaper}) => (
    <View style={styles.paperItem}>
      <View style={styles.paperInfo}>
        <Text style={styles.paperTitle}>{item.name}</Text>
        {item.size && <Text style={styles.paperSize}>Size: {item.size}</Text>}
        {item.uploadDate && (
          <Text style={styles.paperDate}>
            Uploaded: {new Date(item.uploadDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.previewButton]}
          onPress={() => handlePreview(item.url)}>
          <Icon name="eye-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.downloadButton,
            downloading[item.id] && styles.downloadButtonDisabled,
          ]}
          onPress={() => handleDownload(item)}
          disabled={downloading[item.id]}>
          {downloading[item.id] ? (
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
        <Text style={styles.headerTitle}>Past Papers</Text>
      </View>

      {pastPapers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="file-document-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No past papers available</Text>
          <Text style={styles.emptySubtext}>
            Past papers will appear here once they are uploaded.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pastPapers}
          renderItem={renderPaperItem}
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
  paperItem: {
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
  paperInfo: {
    flex: 1,
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  paperSize: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  paperDate: {
    fontSize: 12,
    color: '#666',
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
  previewButton: {
    backgroundColor: '#4CAF50',
  },
  downloadButton: {
    backgroundColor: '#0066cc',
  },
  downloadButtonDisabled: {
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

export default PastPapersScreen;
