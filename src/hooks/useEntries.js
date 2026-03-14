import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  listenToEntries,
  addEntry as addEntryService,
  updateEntry as updateEntryService,
  deleteEntry as deleteEntryService,
} from "../services/entryService";

export default function useEntries() {
  const { user } = useAuth();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToEntries(user.uid, (data) => {
      setEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addEntry = async (entry) => {
    if (!user) return;
    await addEntryService(user.uid, entry);
  };

  const updateEntry = async (id, updatedData) => {
    if (!user) return;
    await updateEntryService(user.uid, id, updatedData);
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