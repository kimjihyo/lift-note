export type WorkoutTag = "chest" | "back" | "shoulders" | "legs" | "arms";

export type WorkoutSet = {
  id: string;
  weight: number; // kg
  reps: number; // 반복 횟수
};

export type Exercise = {
  id: string;
  name: string;
  sets: WorkoutSet[];
};

export type WorkoutRecord = {
  date: string; // YYYY-MM-DD
  tags: WorkoutTag[];
  exercises: Exercise[];
};
