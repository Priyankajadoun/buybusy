// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE_hj1_uf7PwbTNekUgnkksja822l82eY",
  authDomain: "buybusy-718fe.firebaseapp.com",
  projectId: "buybusy-718fe",
  storageBucket: "buybusy-718fe.appspot.com",
  messagingSenderId: "464395275531",
  appId: "1:464395275531:web:ad34a1cd80be3271b7660e"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);

 export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);