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
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { db, analytics } from "../firebase";

export const listenToHabits = (userId, callback) => {
  const ref = query(
    collection(db, "users", userId, "habits"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(ref, (snapshot) => {
    const habits = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(habits);
  });
};

export const addHabit = async (userId, habit) => {
  const ref = collection(db, "users", userId, "habits");

  await addDoc(ref, {
    ...habit,
    completions: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  logEvent(analytics, "add_habit", {
    habit_name: habit.name
  });
};

export const updateHabit = async (userId, id, updatedData) => {
  const ref = doc(db, "users", userId, "habits", id);

  await updateDoc(ref, {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteHabit = async (userId, id) => {
  const ref = doc(db, "users", userId, "habits", id);

  await deleteDoc(ref);
};

export const toggleHabitCompletion = async (userId, habitId, date) => {
  const ref = doc(db, "users", userId, "habits", habitId);
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    const completions = docSnap.data().completions || [];
    const isCompleted = completions.includes(date);

    await updateDoc(ref, {
      completions: isCompleted ? arrayRemove(date) : arrayUnion(date),
      updatedAt: serverTimestamp(),
    });

    if (!isCompleted) {
      logEvent(analytics, "complete_habit", {
        habit_id: habitId,
        date: date
      });
    }
  }
};
