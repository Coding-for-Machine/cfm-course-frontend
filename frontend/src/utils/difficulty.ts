// Ninja API uchun difficulty mapping (easy, medium, hard)
export const difficultyMap: Record<string, { 
  text: string; 
  color: string; 
  bgColor: string;
  value: number; // Frontend uchun numeric value
}> = {
  "easy": { 
    text: "Oson", 
    color: "text-green-400", 
    bgColor: "bg-green-500/20",
    value: 1
  },
  "medium": { 
    text: "O'rtacha", 
    color: "text-yellow-400", 
    bgColor: "bg-yellow-500/20",
    value: 2
  },
  "hard": { 
    text: "Qiyin", 
    color: "text-red-400", 
    bgColor: "bg-red-500/20",
    value: 3
  },
};

// Frontend select uchun options
export const difficultyOptions = [
  { value: "easy", label: "Oson", color: "text-green-400" },
  { value: "medium", label: "O'rtacha", color: "text-yellow-400" },
  { value: "hard", label: "Qiyin", color: "text-red-400" },
];

// Numeric dan string ga
export const getDifficultyFromValue = (value: number): string => {
  const map: Record<number, string> = {
    1: "easy",
    2: "medium",
    3: "hard"
  };
  return map[value] || "medium";
};

// String dan numeric ga
export const getDifficultyValue = (difficulty: string): number => {
  const map: Record<string, number> = {
    "easy": 1,
    "medium": 2,
    "hard": 3
  };
  return map[difficulty] || 2;
};