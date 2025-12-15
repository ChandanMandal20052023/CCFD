import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJajRND43ZaQcOMI9y9U1FduNUqRws-C4",
  authDomain: "edify-e1f91.firebaseapp.com",
  projectId: "edify-e1f91",
  storageBucket: "edify-e1f91.firebasestorage.app",
  messagingSenderId: "907608725939",
  appId: "1:907608725939:web:85236dbdbcb8ecbd03d3c6"
};
const db = getFirestore(app);
const storage = getStorage(app);
const app = initializeApp(firebaseConfig);
export { db, storage };