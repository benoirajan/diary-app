import { useState, useEffect, useCallback, useRef } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Use a ref for search pagination to avoid dependency cycles in performSearch
  const searchLastDocRef = useRef(null);

  const fetchBatch = useCallback(async (isInitial = false) => {
    if (!user || isSearching) return;
    
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
  }, [user, lastDoc, decryptEntry, isSearching]);

  // Greedy search: keep fetching batches until we find matches or run out of data
  const performSearch = useCallback(async (queryTerm, isInitial = false) => {
    if (!user || !queryTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      if (isInitial) {
        setSearchResults([]);
        searchLastDocRef.current = null;
        setSearchHasMore(true);
      }

      let currentResults = []; // Temporary accumulator for this specific call
      let currentLastDoc = isInitial ? null : searchLastDocRef.current;
      let currentHasMore = true;
      let iterations = 0;
      const MAX_ITERATIONS = 5; 
      const TARGET_RESULTS = 10;

      while (currentResults.length < TARGET_RESULTS && currentHasMore && iterations < MAX_ITERATIONS) {
        const result = await getEntriesPaginated(user.uid, 20, currentLastDoc);
        
        const processed = await Promise.all(
          result.entries.map(entry => decryptEntry(entry))
        );

        const matches = processed.filter(entry => 
          entry.title?.toLowerCase().includes(queryTerm.toLowerCase()) ||
          entry.content?.toLowerCase().includes(queryTerm.toLowerCase())
        );

        currentResults = [...currentResults, ...matches];
        currentLastDoc = result.lastDoc;
        currentHasMore = result.hasMore;
        // console.debug(`Search iteration ${iterations + 1}: Found ${matches.length} matches, current batch size: ${currentResults.length}`);
        iterations++;
      }

      setSearchResults(prev => isInitial ? currentResults : [...prev, ...currentResults]);
      searchLastDocRef.current = currentLastDoc;
      setSearchHasMore(currentHasMore);
    } catch (err) {
      console.error("Search Error:", err);
      setError("Search failed to reach the deep vaults.");
    } finally {
      setIsSearching(false);
    }
  }, [user, decryptEntry]); // Removed search state dependencies to break the loop

  useEffect(() => {
    fetchBatch(true);
  }, [user, vaultPassword]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm, true);
      } else {
        setSearchResults([]);
        setIsSearching(false);
        searchLastDocRef.current = null;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  const addEntry = async (entry) => {
    const processedEntry = await encryptEntry(entry);
    await addEntryService(user.uid, processedEntry);
    await fetchBatch(true); 
  };

  const updateEntry = async (id, updatedData) => {
    const processedData = await encryptEntry(updatedData);
    await updateEntryService(user.uid, id, processedData);
    const updateInList = list => list.map(e => e.id === id ? { ...e, ...updatedData } : e);
    setEntries(updateInList);
    setSearchResults(updateInList);
  };

  const deleteEntry = async (id) => {
    await deleteEntryService(user.uid, id);
    const filterFromList = list => list.filter(e => e.id !== id);
    setEntries(filterFromList);
    setSearchResults(filterFromList);
  };

  return {
    entries: searchTerm.trim() ? searchResults : entries,
    searchTerm,
    setSearchTerm,
    loading, 
    loadingMore: searchTerm.trim() ? isSearching : loadingMore,
    hasMore: searchTerm.trim() ? searchHasMore : hasMore,
    isSearching,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    loadMore: () => {
      if (searchTerm.trim()) {
        if (!isSearching && searchHasMore) performSearch(searchTerm, false);
      } else {
        if (!loadingMore && hasMore) fetchBatch(false);
      }
    },
    refresh: () => fetchBatch(true)
  };
}