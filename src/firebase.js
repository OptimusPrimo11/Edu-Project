import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCs7OrAwru7nv2dYu83RdRXOxFyhaK803k",
  authDomain: "educlassify-8b726.firebaseapp.com",
  projectId: "educlassify-8b726",
  storageBucket: "educlassify-8b726.firebasestorage.app",
  messagingSenderId: "79669678667",
  appId: "1:79669678667:web:389a88bcae468e26b673ce"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
