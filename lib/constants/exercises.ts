export const EXERCISE_LIST = [
  "Squat",
  "Bench Press",
  "Deadlift",
  "Overhead Press",
] as const;

export type ExerciseName = (typeof EXERCISE_LIST)[number];
