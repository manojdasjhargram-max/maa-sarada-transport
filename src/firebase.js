import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7V5vzE1HUqlwObp-5pMeTKRVP3YrwUr0",
  authDomain: "maa-sarada-transport-advance.firebaseapp.com",
  databaseURL: "https://maa-sarada-transport-advance-default-rtdb.firebaseio.com",
  projectId: "maa-sarada-transport-advance",
  storageBucket: "maa-sarada-transport-advance.firebasestorage.app",
  messagingSenderId: "605051813855",
  appId: "1:605051813855:web:08709fc1aaf13bae73ce6a",
  measurementId: "G-K26SFK7ED3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);