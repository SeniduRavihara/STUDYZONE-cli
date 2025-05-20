// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAx7PiwMPEYBRmpx02v4aBFQ6e95_IFO40',
  authDomain: 'studyzone-72eef.firebaseapp.com',
  projectId: 'studyzone-72eef',
  storageBucket: 'studyzone-72eef.firebasestorage.app',
  messagingSenderId: '516596649090',
  appId: '1:516596649090:web:8704d5ef79d373b4e1389b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const auth = getAuth(app);
// export const provider = new GoogleAuthProvider();
