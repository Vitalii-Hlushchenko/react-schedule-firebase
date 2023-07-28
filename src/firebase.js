// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnb-X7JPvvDGg-Qb6fkIcsz7xIEDqhJ0Q",
  authDomain: "react-schedule-6d763.firebaseapp.com",
  projectId: "react-schedule-6d763",
  storageBucket: "react-schedule-6d763.appspot.com",
  messagingSenderId: "732447206689",
  appId: "1:732447206689:web:d7edc2cdd4329f74966260"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
