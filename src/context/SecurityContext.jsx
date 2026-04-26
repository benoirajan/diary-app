import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import * as crypto from "../utils/crypto";

const SecurityContext = createContext();

export function SecurityProvider({ children }) {
  const { profile } = useAuth();
  const [vaultPassword, setVaultPassword] = useState(null);

  // Automatically "unlock" when profile with vaultKey is available
  useEffect(() => {
    if (profile?.vaultKey) {
      setVaultPassword(profile.vaultKey);
    } else {
      setVaultPassword(null);
    }
  }, [profile]);

  const isLocked = !vaultPassword;
  const encryptAll = profile?.settings?.encryptAll || false;

  const updateSettings = useCallback(async (newSettings) => {
    if (!profile?.uid) {
        console.error("Cannot update settings: User ID is missing");
        return;
    }
    const userRef = doc(db, "users", profile.uid);
    await updateDoc(userRef, {
      settings: {
        ...(profile.settings || {}),
        ...newSettings
      }
    });
  }, [profile]);

  const encryptEntry = useCallback(async (entry, forceEncrypt = false) => {
    // Encrypt if global "encryptAll" is on OR if this specific entry requested it
    const shouldEncrypt = encryptAll || forceEncrypt || entry.isEncrypted;
    
    if (!vaultPassword || !shouldEncrypt) return entry;

    const encryptedTitle = await crypto.encrypt(entry.title, vaultPassword);
    const encryptedContent = await crypto.encrypt(entry.content, vaultPassword);

    return {
      ...entry,
      title: encryptedTitle,
      content: encryptedContent,
      isEncrypted: true,
    };
  }, [vaultPassword, encryptAll]);

  const decryptEntry = useCallback(async (entry) => {
    if (!entry.isEncrypted) return entry;
    if (!vaultPassword) return { ...entry, isLocked: true };

    try {
      const decryptedTitle = await crypto.decrypt(entry.title, vaultPassword);
      const decryptedContent = await crypto.decrypt(entry.content, vaultPassword);

      return {
        ...entry,
        title: decryptedTitle,
        content: decryptedContent,
        isLocked: false,
      };
    } catch (err) {
      console.error("Failed to decrypt entry:", err);
      return { ...entry, isLocked: true, decryptionError: true };
    }
  }, [vaultPassword]);

  return (
    <SecurityContext.Provider value={{ 
      vaultPassword, 
      isLocked, 
      encryptAll,
      updateSettings,
      encryptEntry, 
      decryptEntry 
    }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
}
