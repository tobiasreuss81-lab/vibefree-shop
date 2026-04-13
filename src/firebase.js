import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMgL_ubB-TB9f1-9jVviflt0YkJ1nMKU4",
  authDomain: "vibefree-shop.firebaseapp.com",
  projectId: "vibefree-shop",
  storageBucket: "vibefree-shop.firebasestorage.app",
  messagingSenderId: "581720286340",
  appId: "1:581720286340:web:e009ccc53ae9ce9d224ed1",
  measurementId: "G-CJFLMTZTW9"
};

const app = initializeApp(firebaseConfig);

// 🔥 Datenbank + Speicher
export const db = getFirestore(app);
export const storage = getStorage(app);