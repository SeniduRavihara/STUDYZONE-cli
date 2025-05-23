import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppStackParamList} from '../../../navigation/AppStack';
import {RootStackParamList} from '../../../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  AppStackParamList & RootStackParamList,
  'Quizzes'
>;

const QuizzesScreen = ({navigation, route}: Props) => {
  const {academicYear, semester, subject, subjectCode, subjectName} =
    route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="chevron-left" size={30} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Quizzes</Text>
      <Text style={styles.subtitle}>
        {subjectCode} - {subjectName}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
});

export default QuizzesScreen;
