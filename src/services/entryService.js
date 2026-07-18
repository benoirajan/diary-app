import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
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

export const getEntriesMetadata = async (userId) => {
  const q = query(
    collection(db, "users", userId, "entries"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      date: data.date,
      mood: data.mood,
      createdAt: data.createdAt,
      isLocked: data.isLocked
    };
  });
};

export const getEntriesPaginated = async (userId, pageSize = 15, lastDoc = null) => {
  let q = query(
    collection(db, "users", userId, "entries"),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    entries,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === pageSize
  };
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