import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDXop9qsfdduX-0nMbQPOe4NhGMsdZEKJE",
    authDomain: "innolink-db320.firebaseapp.com",
    projectId: "innolink-db320",
    storageBucket: "innolink-db320.firebasestorage.app",
    messagingSenderId: "1002307153142",
    appId: "1:1002307153142:web:98ee9851c6b3ff387e50d7",
    measurementId: "G-6S4Z9XLX6N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;
