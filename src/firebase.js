import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7V5zEiHUqW0bp-5pMeTkRV3Ywrug",
  authDomain: "maa-sarada-transport-advance.firebaseapp.com",
  projectId: "maa-sarada-transport-advance",
  storageBucket: "maa-sarada-transport-advance.firebasestorage.app",
  messagingSenderId: "605051381855",
  appId: "1:605051381855:web:08709fc1aaf13bae73ce6a",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);