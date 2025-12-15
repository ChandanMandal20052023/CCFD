import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // <-- ZAROORI: getAuth ko import karein

const firebaseConfig = {
  apiKey: "AIzaSyCJajRND43ZaQcOMI9y9U1FduNUqRws-C4",
  authDomain: "edify-e1f91.firebaseapp.com",
  projectId: "edify-e1f91",
  storageBucket: "edify-e1f91.firebasestorage.app",
  messagingSenderId: "907608725939",
  appId: "1:907608725939:web:85236dbdbcb8ecbd03d3c6"
};

// --- YEH HAI SAHI ORDER ---

// 1. App ko sabse pehle initialize karein
const app = initializeApp(firebaseConfig);

// 2. Uske baad services ko initialize karein
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // <-- Auth service ko initialize karein

// 3. Sabko export karein
export { db, storage, auth }; // <-- Auth ko bhi export karein
