// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCoOaQYv3pYwArvlGy-45zPSZikH6OeSbs',
  authDomain: 'sisiquiz.firebaseapp.com', //sisiquiz.firebaseapp.com
  projectId: 'sisiquiz',
  storageBucket: 'sisiquiz.firebasestorage.app',
  messagingSenderId: '327586798593',
  appId: '1:327586798593:web:9d616859645e69a6c63400',
  measurementId: 'G-LG3QN882DG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Safe Analytics init
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn('Analytics not supported in this browser.');
    }
  });
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
