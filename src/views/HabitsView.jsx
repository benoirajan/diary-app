import { useState } from "react";
import useHabits from "../hooks/useHabits";
import { useModal } from "../context/ModalContext";
import { useToast } from "../context/ToastContext";

const HabitsView = () => {
  const {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
  } = useHabits();

  const { confirm } = useModal();
  const { showToast } = useToast();

  const [newHabitName, setNewHabitName] = useState("");
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // Helper to get last 7 days for the tracker
  const getLastNDays = (n) => {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };

  const last7Days = getLastNDays(7);

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit({ name: newHabitName.trim() });
    setNewHabitName("");
  };

  const handleUpdateHabit = (e) => {
    e.preventDefault();
    if (!editingValue.trim() || !editingHabitId) return;
    updateHabit(editingHabitId, { name: editingValue.trim() });
    setEditingHabitId(null);
    setEditingValue("");
  };

  const startEditing = (habit) => {
    setEditingHabitId(habit.id);
    setEditingValue(habit.name);
  };

  const cancelEditing = () => {
    setEditingHabitId(null);
    setEditingValue("");
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading habits...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Add Habit Form */}
      <div className="bg-[var(--bg-card)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--bg-soft)]">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">New Habit<span className="text-[var(--accent-happy)]">.</span></h2>
        <form onSubmit={handleAddHabit} className="flex gap-3">
          <input
            type="text"
            placeholder="What habit would you like to track?"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="flex-1 px-5 py-3 rounded-2xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] font-medium text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[var(--accent-happy)] text-[var(--text-primary)] font-black text-sm hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-amber-200/20"
          >
            Add
          </button>
        </form>
      </div>

      {/* Habit List */}
      <div className="grid grid-cols-1 gap-4">
        {habits.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-soft)]/30 rounded-3xl border border-dashed border-[var(--bg-soft)]">
            <p className="text-[var(--text-secondary)] italic">No habits yet. Start small!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-[var(--bg-card)] rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--bg-soft)] flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="flex-1 space-y-1">
                {editingHabitId === habit.id ? (
                  <form onSubmit={handleUpdateHabit} className="flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-[var(--bg-soft)] border-none focus:ring-2 focus:ring-[var(--accent-happy)] outline-none transition-all text-[var(--text-primary)] font-medium text-sm"
                    />
                    <button
                      type="submit"
                      className="p-2 text-[var(--accent-happy)] hover:scale-110 transition-transform"
                      title="Save"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Cancel"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-happy)] transition-colors">
                        {habit.name}
                      </h3>
                      <button
                        onClick={() => startEditing(habit)}
                        className="p-1 text-gray-400 hover:text-[var(--accent-happy)] md:opacity-0 md:group-hover:opacity-100 transition-all"
                        title="Edit Habit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                      Streak: {calculateStreak(habit.completions)} days
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {last7Days.map((date) => {
                  const isCompleted = habit.completions?.includes(date);
                  const isToday = date === today;
                  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "narrow" });

                  return (
                    <div key={date} className="flex flex-col items-center gap-1 pb-2">
                      <span className={`text-[9px] font-bold ${isToday ? 'text-[var(--accent-happy)]' : 'text-[var(--text-secondary)]'}`}>
                        {dayName}
                      </span>
                      <button
                        onClick={() => toggleHabitCompletion(habit.id, date)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-[var(--accent-happy)] text-[var(--text-primary)] shadow-sm"
                            : "bg-[var(--bg-soft)] text-[var(--text-secondary)] hover:bg-gray-200"
                        } ${isToday ? 'ring-2 ring-[var(--accent-happy)] ring-offset-2' : ''}`}
                      >
                        {isCompleted ? "✓" : ""}
                      </button>
                    </div>
                  );
                })}
                
                <button
                  onClick={async () => {
                    const confirmed = await confirm({
                      title: "Delete Habit?",
                      message: `Are you sure you want to remove "${habit.name}"? This action cannot be undone.`,
                      confirmText: "Delete",
                      type: "danger"
                    });
                    
                    if (confirmed) {
                      try {
                        await deleteHabit(habit.id);
                        showToast("Habit deleted successfully");
                      } catch (err) {
                        showToast("Failed to delete habit", "error");
                      }
                    }
                  }}
                  className="ml-4 p-2 text-red-400 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 transition-all"
                  title="Delete Habit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Simple streak calculation (consecutive days including today/yesterday)
function calculateStreak(completions = []) {
  if (completions.length === 0) return 0;
  
  const sortedDates = [...completions].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = today;

  // Check if we have completion for today or yesterday to start streak
  const lastCompletion = new Date(sortedDates[0]);
  lastCompletion.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(currentDate - lastCompletion);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) return 0; // Streak broken if last completion was more than 1 day ago

  // If last completion was yesterday, we start checking from there
  if (diffDays === 1) {
    currentDate = lastCompletion;
  }

  for (let i = 0; i < sortedDates.length; i++) {
    const compDate = new Date(sortedDates[i]);
    compDate.setHours(0, 0, 0, 0);
    
    if (compDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (compDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return streak;
}

export default HabitsView;
