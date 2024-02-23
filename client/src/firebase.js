// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "eyad-store.firebaseapp.com",
  projectId: "eyad-store",
  storageBucket: "eyad-store.appspot.com",
  messagingSenderId: "285590195348",
  appId: "1:285590195348:web:eaaa0529a70320be96b881",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
