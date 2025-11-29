import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyABK-g1JK4-x0B-vQ01KG4lzmuN6Dz8V3Q",
    authDomain: "revat-f9c1d.firebaseapp.com",
    projectId: "revat-f9c1d",
    storageBucket: "revat-f9c1d.firebasestorage.app",
    messagingSenderId: "344042508930",
    appId: "1:344042508930:web:002a246cfde93c6e481a9b"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
