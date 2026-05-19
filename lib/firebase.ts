import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD4rWW9Uy5NL6VeJqJ3cpzaUr_Z-pknp-w",
  authDomain: "madebyankit-695fc.firebaseapp.com",
  databaseURL: "https://madebyankit-695fc-default-rtdb.firebaseio.com",
  projectId: "madebyankit-695fc",
  storageBucket: "madebyankit-695fc.firebasestorage.app",
  messagingSenderId: "409354277389",
  appId: "1:409354277389:web:775e40a25843be78d33b44",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);