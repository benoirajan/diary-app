import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { auth, db, analytics } from "../firebase";
import { useRemoteConfig } from "./RemoteConfigContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { config } = useRemoteConfig();

  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            const randomKey = Array.from(window.crypto.getRandomValues(new Uint8Array(24)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || "",
              isAdmin: false,
              vaultKey: randomKey,
              settings: {
                encryptAll: config.is_encrypted,
              },
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };
            await setDoc(userDocRef, newProfile);
            logEvent(analytics, "sign_up", { method: firebaseUser.providerData[0]?.providerId || "unknown" });
          } else {
            const existingProfile = userDoc.data();
            if (!existingProfile.vaultKey) {
                const randomKey = Array.from(window.crypto.getRandomValues(new Uint8Array(24)))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
                await setDoc(userDocRef, { 
                    vaultKey: randomKey,
                    settings: existingProfile.settings || { encryptAll: false }
                }, { merge: true });
            }
            await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
            logEvent(analytics, "login", { method: firebaseUser.providerData[0]?.providerId || "unknown" });
          }

          // Start listening to the profile document for real-time updates
          unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              setProfile({ uid: firebaseUser.uid, ...doc.data() });
            }
            setLoading(false);
          });

          setUser(firebaseUser);
        } catch (err) {
          console.error("Error managing user profile:", err);
          setUser(firebaseUser);
          setProfile(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        unsubscribeProfile();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
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