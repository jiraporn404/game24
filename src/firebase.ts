// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9TTO3PX1BDBcgQPzkDL4xzw_2wUJvSi0",
  authDomain: "game24-d79c9.firebaseapp.com",
  projectId: "game24-d79c9",
  storageBucket: "game24-d79c9.firebasestorage.app",
  messagingSenderId: "866955282884",
  appId: "1:866955282884:web:7fecb1af259e3f835c7c91",
  measurementId: "G-7798X58DCX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
