import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import * as habitService from "../services/habitService";

const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = habitService.listenToHabits(user.uid, (data) => {
      setHabits(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addHabit = async (habit) => {
    try {
      await habitService.addHabit(user.uid, habit);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateHabit = async (id, data) => {
    try {
      await habitService.updateHabit(user.uid, id, data);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await habitService.deleteHabit(user.uid, id);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleHabitCompletion = async (habitId, date) => {
    try {
      await habitService.toggleHabitCompletion(user.uid, habitId, date);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
  };
};

export default useHabits;
