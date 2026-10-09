// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEtOO1eihj-qBoxpHNhr8_QK6Z4w7dF9M",
  authDomain: "recycle-7a5b5.firebaseapp.com",
  projectId: "recycle-7a5b5",
  storageBucket: "recycle-7a5b5.firebasestorage.app",
  messagingSenderId: "665555136590",
  appId: "1:665555136590:web:7603f60732cb6611b9131f",
  measurementId: "G-NSVKJXXKZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
