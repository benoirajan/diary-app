import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  startAfter,
  writeBatch,
  doc,
  where
} from "firebase/firestore";
import { db } from "../firebase";

const MOOD_MAPPING = {
  happy: "joyful",
  sad: "down",
  excited: "radiant",
  angry: "rough",
  calm: "peaceful"
};

/**
 * Bulk updates all entries from old mood values to new ones.
 * WARNING: This is a heavy operation. Use with caution.
 */
export const migrateOldMoods = async () => {
  const usersRef = collection(db, "users");
  const usersSnapshot = await getDocs(usersRef);
  let totalUpdated = 0;

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const entriesRef = collection(db, "users", userId, "entries");
    
    // Find entries that still have old mood values
    const q = query(entriesRef, where("mood", "in", Object.keys(MOOD_MAPPING)));
    const entriesSnapshot = await getDocs(q);

    if (entriesSnapshot.empty) continue;

    const batch = writeBatch(db);
    entriesSnapshot.docs.forEach((entryDoc) => {
      const oldMood = entryDoc.data().mood;
      const newMood = MOOD_MAPPING[oldMood];
      
      if (newMood) {
        batch.update(doc(db, "users", userId, "entries", entryDoc.id), {
          mood: newMood,
          updatedAt: new Date()
        });
        totalUpdated++;
      }
    });

    await batch.commit();
    console.log(`Migrated entries for user: ${userId}`);
  }

  return totalUpdated;
};

export const getAllUsers = async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("lastLogin", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getUserStats = async (userId) => {
  // Fetch entries count
  const entriesRef = collection(db, "users", userId, "entries");
  const entriesSnapshot = await getDocs(entriesRef);
  const totalEntries = entriesSnapshot.size;

  // Fetch habits count
  const habitsRef = collection(db, "users", userId, "habits");
  const habitsSnapshot = await getDocs(habitsRef);
  const totalHabits = habitsSnapshot.size;

  // Calculate mood distribution and consistency
  const entries = entriesSnapshot.docs.map(doc => doc.data());
  const moods = entries.map(e => e.mood).filter(Boolean);
  const moodAvg = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
  console.log(moodAvg, moods);

  return {
    totalEntries,
    totalHabits,
    moodAvg: Math.round(moodAvg * 10) / 10,
    lastEntry: entries.length > 0 ? entries.sort((a,b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())[0] : null
  };
};

export const getUserActivity = async (userId, lastVisibleEntry = null, pageSize = 15) => {
    const entriesRef = collection(db, "users", userId, "entries");
    
    let qEntries;
    if (lastVisibleEntry) {
        qEntries = query(
            entriesRef, 
            orderBy("createdAt", "desc"), 
            startAfter(lastVisibleEntry),
            limit(pageSize)
        );
    } else {
        qEntries = query(
            entriesRef, 
            orderBy("createdAt", "desc"), 
            limit(pageSize)
        );
    }
    
    const entriesSnapshot = await getDocs(qEntries);
    const entries = entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastDoc = entriesSnapshot.docs[entriesSnapshot.docs.length - 1];

    // For habits, we usually want to see all active ones as they are few
    let habits = [];
    if (!lastVisibleEntry) {
        const habitsRef = collection(db, "users", userId, "habits");
        const habitsSnapshot = await getDocs(habitsRef);
        habits = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    return {
        entries,
        habits,
        lastDoc,
        hasMore: entries.length === pageSize
    };
}

export const getFeedbacks = async () => {
  const feedbackRef = collection(db, "feedback");
  const q = query(feedbackRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
