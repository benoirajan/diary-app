import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSecurity } from "../context/SecurityContext";
import {
  listenToEntries,
  addEntry as addEntryService,
  updateEntry as updateEntryService,
  deleteEntry as deleteEntryService,
} from "../services/entryService";

export default function useEntries() {
  const { user } = useAuth();
  const { encryptEntry, decryptEntry, vaultPassword } = useSecurity();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToEntries(user.uid, async (data) => {
      // Decrypt entries if necessary
      const processedEntries = await Promise.all(
        data.map(entry => decryptEntry(entry))
      );
      setEntries(processedEntries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, decryptEntry, vaultPassword]);

  const addEntry = async (entry) => {
    if (!user) return;
    const processedEntry = await encryptEntry(entry);
    await addEntryService(user.uid, processedEntry);
  };

  const updateEntry = async (id, updatedData) => {
    if (!user) return;
    const processedData = await encryptEntry(updatedData);
    await updateEntryService(user.uid, id, processedData);
  };

  const deleteEntry = async (id) => {
    if (!user) return;
    await deleteEntryService(user.uid, id);
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}