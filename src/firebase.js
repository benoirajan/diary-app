import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBn3qDM0SNi0NRYbCgpAc6DDeByg6s1iUc",
    authDomain: "diary360.firebaseapp.com",
    databaseURL: "https://diary360-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "diary360",
    storageBucket: "diary360.appspot.com",
    messagingSenderId: "590616453663",
    appId: "1:590616453663:web:966a947e9b1ae46c5a6b2a",
    measurementId: "G-7X86N4GF7R"
  };

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)