export type MoodEntry = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  score: number; // 1..5
  note?: string;
};

export type ProcessedPoint = {
  date: string;
  score: number;
  rolling?: number;
  isAnomaly?: boolean;
};
