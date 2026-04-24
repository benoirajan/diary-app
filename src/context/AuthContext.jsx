import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { auth, db, analytics } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Fetch or create user profile
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || "",
              isAdmin: false,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
            logEvent(analytics, "sign_up", { method: firebaseUser.providerData[0]?.providerId || "unknown" });
          } else {
            const existingProfile = userDoc.data();
            // Update last login
            await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
            setProfile({ ...existingProfile, lastLogin: new Date() });
            logEvent(analytics, "login", { method: firebaseUser.providerData[0]?.providerId || "unknown" });
          }
          setUser(firebaseUser);
        } catch (err) {
          console.error("Error managing user profile:", err);
          // Still allow user to log in but profile will be null
          setUser(firebaseUser);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = profile?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}