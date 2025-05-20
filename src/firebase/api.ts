import {User} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {db, storage} from './config';
import { Course, UserDataType } from '../types';

export const featchCurrentUserData = async (currentUser: User) => {
  try {
    const documentRef = doc(db, 'users', currentUser.uid);
    const userDataDoc = await getDoc(documentRef);

    if (userDataDoc.exists()) {
      const userData = userDataDoc.data() as UserDataType;
      console.log('Current user data fetched successfully');
      return userData;
    } else {
      console.log('Document does not exist.');
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//--------------------------------------------------------

export const addNewCourse = async (courseData: Course) => {
  const courseCollectionRef = doc(db, 'courses', courseData.id);
  try {
    await setDoc(courseCollectionRef, courseData);
  } catch (error) {
    console.error('Error adding new course:', error);
    throw error;
  }
};

// ------------------------------------------------------------

export const updateCourse = async (courseData: Course) => {
  const courseCollectionRef = doc(db, 'courses', courseData.id);
  try {
    await setDoc(courseCollectionRef, courseData);
  } catch (error) {
    console.error('Error adding new course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string) => {
  const courseCollectionRef = doc(db, 'courses', courseId);
  try {
    await deleteDoc(courseCollectionRef);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const getCoursesForYearAndSemester = async (
  year: string,
  semester: string,
) => {
  const coursesCollectionRef = collection(db, 'courses');
  const q = query(
    coursesCollectionRef,
    where('academicYear', '==', year),
    where('semester', '==', semester),
  );

  const queryStoresSnapshot = await getDocs(q);

  const storeListArr = queryStoresSnapshot.docs.map(doc => ({
    ...doc.data(),
  })) as Course[];

  return storeListArr;
};

//---------------------------------------------------

export const uploadPP = async (
  blob: Blob,
  name: string,
  courseId: string,
  fileSizeInMB: string,
  timestamp: Date,
) => {
  const fileRef = ref(storage, `past-papers/${courseId}/${name}`);
  await uploadBytes(fileRef, blob);

  const docURL = await getDownloadURL(fileRef);

  // Add document to Firestore
  const docRef = doc(db, 'courses', courseId);
  const pdfs = (await getDoc(docRef)).data()?.pastPapers || [];
  await updateDoc(docRef, {
    pastPapers: [
      ...pdfs,
      {
        id: `${name}-${timestamp}`,
        name,
        url: docURL,
        uploadDate: new Date(),
        size: fileSizeInMB,
      },
    ],
  });
};

export const deletePP = async (name: string, courseId: string) => {
  const fileRef = ref(storage, `past-papers/${courseId}/${name}`);
  await deleteObject(fileRef);

  // Remove document from Firestore
  const docRef = doc(db, 'courses', courseId);
  const pdfs = (await getDoc(docRef)).data()?.pastPapers || [];
  const updatedPdfs = pdfs.filter((pdf: any) => pdf.name !== name);
  await updateDoc(docRef, {
    pastPapers: updatedPdfs,
  });
};

//---------------------------------------------------

export const uploadQuizes = async (
  blob: Blob,
  fileName: string,
  title: string,
  courseId: string,
  fileSizeInMB: string,
  timestamp: Date,
  questions: number,
) => {
  const fileRef = ref(storage, `quizzes/${courseId}/${fileName}`);
  await uploadBytes(fileRef, blob);

  const docURL = await getDownloadURL(fileRef);

  // Add document to Firestore
  const docRef = doc(db, 'courses', courseId);
  const pdfs = (await getDoc(docRef)).data()?.quizzes || [];
  await updateDoc(docRef, {
    quizzes: [
      ...pdfs,
      {
        id: `${fileName}-${timestamp}`,
        title: title,
        url: docURL,
        uploadDate: new Date(),
        size: fileSizeInMB,
        questions: questions,
        fileName: fileName,
      },
    ],
  });
};

export const deleteQuizes = async (fileName: string, courseId: string) => {
  const fileRef = ref(storage, `quizzes/${courseId}/${fileName}`);
  await deleteObject(fileRef);

  // Remove document from Firestore
  const docRef = doc(db, 'courses', courseId);
  const pdfs = (await getDoc(docRef)).data()?.quizzes || [];
  const updatedQuizzes = pdfs.filter((quiz: any) => quiz.fileName !== fileName);
  await updateDoc(docRef, {
    quizzes: updatedQuizzes,
  });
};

// ---------------------------------------------------

export const addYtVideo = async (
  courseId: string,
  title: string,
  url: string,
  thumbnailUrl: string,
  videoId: string,
  addedOn: Date,
) => {
  const docRef = doc(db, 'courses', courseId);
  const videos = (await getDoc(docRef)).data()?.videos || [];
  await updateDoc(docRef, {
    videos: [...videos, {title, url, thumbnailUrl, videoId, addedOn}],
  });
};

export const deleteYtVideo = async (courseId: string, id: string) => {
  console.log('Deleting video with id:', id);

  // Remove document from Firestore
  const docRef = doc(db, 'courses', courseId);
  const videos = (await getDoc(docRef)).data()?.videos || [];
  const updatedVideos = videos.filter((video: any) => video.videoId !== id);
  await updateDoc(docRef, {
    videos: updatedVideos,
  });
};

// ----------------------------------------------------------------------------

export const getPPsForCourse = async (courseId: string) => {
  const docRef = doc(db, 'courses', courseId);
  const pdfs = (await getDoc(docRef)).data()?.pastPapers || [];
  return pdfs;
};

export const getYtVideosForCourse = async (courseId: string) => {
  const docRef = doc(db, 'courses', courseId);
  const videos = (await getDoc(docRef)).data()?.videos || [];
  return videos;
};
