import {
    collection,
    addDoc,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  export const submitFeedback = async (userId, feedbackData) => {
    const ref = collection(db, "feedback");
  
    await addDoc(ref, {
      ...feedbackData,
      userId,
      createdAt: serverTimestamp(),
    });
  };