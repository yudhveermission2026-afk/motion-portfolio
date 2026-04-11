import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBx9YisU4FrWgfijUfTnRjyDhGbUu8o2ME",
  authDomain: "ankit-portfolio-e112e.firebaseapp.com",
  projectId: "ankit-portfolio-e112e",
  storageBucket: "ankit-portfolio-e112e.firebasestorage.app",
  messagingSenderId: "313685775294",
  appId: "1:313685775294:web:358388f965d45a24495fef",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);