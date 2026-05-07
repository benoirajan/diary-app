import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useSecurity } from "../context/SecurityContext";
import {
  getEntriesPaginated,
  addEntry as addEntryService,
  updateEntry as updateEntryService,
  deleteEntry as deleteEntryService,
} from "../services/entryService";

export default function useEntries() {
  const { user } = useAuth();
  const { encryptEntry, decryptEntry, vaultPassword } = useSecurity();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatch = useCallback(async (isInitial = false) => {
    if (!user) return;
    
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const result = await getEntriesPaginated(user.uid, 15, isInitial ? null : lastDoc);
      
      const processed = await Promise.all(
        result.entries.map(entry => decryptEntry(entry))
      );

      setEntries(prev => isInitial ? processed : [...prev, ...processed]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error("useEntries Error:", err);
      setError("Failed to sync memories.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, lastDoc, decryptEntry]);

  useEffect(() => {
    fetchBatch(true);
  }, [user, vaultPassword]);

  const addEntry = async (entry) => {
    const processedEntry = await encryptEntry(entry);
    await addEntryService(user.uid, processedEntry);
    await fetchBatch(true); // Reset list to show new entry
  };

  const updateEntry = async (id, updatedData) => {
    const processedData = await encryptEntry(updatedData);
    await updateEntryService(user.uid, id, processedData);
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updatedData } : e));
  };

  const deleteEntry = async (id) => {
    await deleteEntryService(user.uid, id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return {
    entries,
    loading,
    loadingMore,
    hasMore,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    loadMore: () => !loadingMore && hasMore && fetchBatch(false),
    refresh: () => fetchBatch(true)
  };
}