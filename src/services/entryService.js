import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { db, analytics } from "../firebase";

export const listenToEntries = (userId, callback) => {
  const ref = query(
    collection(db, "users", userId, "entries"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(ref, (snapshot) => {
    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(entries);
  });
};

export const addEntry = async (userId, entry) => {
  const ref = collection(db, "users", userId, "entries");

  await addDoc(ref, {
    ...entry,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  logEvent(analytics, "create_entry", {
    mood: entry.mood,
    has_content: !!entry.content,
    is_ai_generated: !!entry.isAiGenerated
  });
};
  export const updateEntry = async (userId, id, updatedData) => {
    const ref = doc(db, "users", userId, "entries", id);
  
    await updateDoc(ref, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  };
  
  export const deleteEntry = async (userId, id) => {
    const ref = doc(db, "users", userId, "entries", id);
  
    await deleteDoc(ref);
  };