import {
    collection,
    addDoc,
    serverTimestamp,
  } from "firebase/firestore";
  import { logEvent } from "firebase/analytics";
  import { db, analytics } from "../firebase";
  
  export const submitFeedback = async (userId, feedbackData) => {
    const ref = collection(db, "feedback");
  
    await addDoc(ref, {
      ...feedbackData,
      userId,
      createdAt: serverTimestamp(),
    });

    logEvent(analytics, "submit_feedback", {
      type: feedbackData.type
    });
  };