// AppStack.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/app_stack/HomeScreen';
import PastPapersScreen from '../screens/app_stack/resources/PastPapersScreen';
import QuizzesScreen from '../screens/app_stack/resources/QuizzesScreen';
import YouTubeVideosScreen from '../screens/app_stack/resources/YouTubeVideosScreen';
import SelectModuleScreen from '../screens/app_stack/SelectModuleScreen';
import SelectSemesterScreen from '../screens/app_stack/SelectSemesterScreen';
import SelectStudyMaterialScreen from '../screens/app_stack/SelectStudyMaterialScreen';
import SelectYearScreen from '../screens/app_stack/SelectYearScreen';
import {PastPaper, Quiz, VideoLink} from '../types';

export type AppStackParamList = {
  Home: undefined;
  SelectYear: undefined;
  SelectSemester: {
    academicYear: string;
  };
  SelectModule: {
    academicYear: string;
    semester: string;
  };
  SelectStudyMaterial: {
    academicYear: string;
    semester: string;
    subject: string;
    subjectCode: string;
    subjectName: string;
    pastPapers?: PastPaper[];
    videos?: VideoLink[];
    quizzes?: Quiz[];
  };
  PastPapers: {
    academicYear: string;
    semester: string;
    subject: string;
    subjectCode: string;
    subjectName: string;
    resourceType: 'past-papers';
    pastPapers: PastPaper[];
  };
  YouTubeVideos: {
    academicYear: string;
    semester: string;
    subject: string;
    subjectCode: string;
    subjectName: string;
    resourceType: 'youtube-videos';
    videos: VideoLink[];
  };
  Quizzes: {
    academicYear: string;
    semester: string;
    subject: string;
    subjectCode: string;
    subjectName: string;
    resourceType: 'quizzes';
    quizzes: Quiz[];
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SelectYear" component={SelectYearScreen} />
      <Stack.Screen name="SelectSemester" component={SelectSemesterScreen} />
      <Stack.Screen name="SelectModule" component={SelectModuleScreen} />
      <Stack.Screen
        name="SelectStudyMaterial"
        component={SelectStudyMaterialScreen}
      />
      <Stack.Screen name="PastPapers" component={PastPapersScreen} />
      <Stack.Screen name="YouTubeVideos" component={YouTubeVideosScreen} />
      <Stack.Screen name="Quizzes" component={QuizzesScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
