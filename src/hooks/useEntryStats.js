import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getEntriesMetadata } from "../services/entryService";

export default function useEntryStats() {
  const { user } = useAuth();
  const [allMetadata, setAllMetadata] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMetadata = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getEntriesMetadata(user.uid);
      setAllMetadata(data);
    } catch (err) {
      console.error("Error fetching metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, [user]);

  const streak = useMemo(() => {
    if (!allMetadata.length) return 0;

    const daysWithEntries = [...new Set(allMetadata
        .filter(e => e.date || e.createdAt)
        .map(e => {
            let date;
            if (e.date) {
                date = new Date(e.date);
            } else if (e.createdAt && typeof e.createdAt.toDate === 'function') {
                date = e.createdAt.toDate();
            } else {
                date = new Date(e.createdAt);
            }
            return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        })
    )].sort((a, b) => b - a);

    if (daysWithEntries.length === 0) return 0;

    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();

    if (daysWithEntries[0] < yesterday) return 0;

    let currentStreak = 0;
    let expectedDay = daysWithEntries[0];

    for (const day of daysWithEntries) {
        if (Math.abs(day - expectedDay) < 3600000) {
            currentStreak++;
            const prevDay = new Date(expectedDay);
            prevDay.setDate(prevDay.getDate() - 1);
            expectedDay = prevDay.getTime();
        } else {
            break;
        }
    }
    return currentStreak;
  }, [allMetadata]);

  return {
    allMetadata,
    streak,
    loading,
    refreshStats: fetchMetadata
  };
}