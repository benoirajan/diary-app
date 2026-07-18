export const moods = [
  { label: "Radiant", value: "radiant", emoji: "🤩" },
  { label: "Joyful", value: "joyful", emoji: "😊" },
  { label: "Peaceful", value: "peaceful", emoji: "😌" },
  { label: "Down", value: "down", emoji: "😔" },
  { label: "Rough", value: "rough", emoji: "😫" },
];

export const moodScores = {
  radiant: 5,
  joyful: 4,
  peaceful: 3,
  down: 2,
  rough: 1,
  // Backward compatibility for existing entries
  excited: 5,
  happy: 4,
  calm: 3,
  sad: 2,
  angry: 1
};

export const moodColors = {
  radiant: "bg-[var(--accent-excited)]",
  joyful: "bg-[var(--accent-happy)]",
  peaceful: "bg-[var(--accent-calm)]",
  down: "bg-[var(--accent-sad)]",
  rough: "bg-[var(--accent-angry)]",
  // Backward compatibility
  excited: "bg-[var(--accent-excited)]",
  happy: "bg-[var(--accent-happy)]",
  calm: "bg-[var(--accent-calm)]",
  sad: "bg-[var(--accent-sad)]",
  angry: "bg-[var(--accent-angry)]",
  neutral: "bg-[var(--accent-neutral)]",
};

export const getMoodLabel = (value) => {
  return moods.find(m => m.value === value)?.label || value;
};

export const getMoodEmoji = (value) => {
  return moods.find(m => m.value === value)?.emoji || "😶";
};

export const getMoodScore = (value) => {
  return moodScores[value] || 3;
};
