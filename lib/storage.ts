import type { WorkoutRecord } from "@/lib/types";
import { EXERCISE_LIST } from "@/lib/constants/exercises";

const STORAGE_KEY = "lift-memo-workouts";
const EXERCISES_STORAGE_KEY = "lift-memo-exercises";

export function getWorkoutRecords(): WorkoutRecord[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getWorkoutRecordByDate(
  date: string
): Promise<WorkoutRecord | null> {
  const records = getWorkoutRecords();
  return Promise.resolve(
    records.find((record) => record.date === date) || null
  );
}

export function saveWorkoutRecord(record: WorkoutRecord): void {
  const records = getWorkoutRecords();
  const existingIndex = records.findIndex((r) => r.date === record.date);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function deleteWorkoutRecord(date: string): void {
  const records = getWorkoutRecords();
  const filtered = records.filter((r) => r.date !== date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Exercise 목록 관리
export function getExerciseList(): string[] {
  if (typeof window === "undefined") return [...EXERCISE_LIST];

  const data = localStorage.getItem(EXERCISES_STORAGE_KEY);
  if (!data) {
    // 초기값이 없으면 기본 목록을 저장하고 반환
    const defaultList = [...EXERCISE_LIST];
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(defaultList));
    return defaultList;
  }

  try {
    return JSON.parse(data);
  } catch {
    return [...EXERCISE_LIST];
  }
}

export function addExerciseToList(exerciseName: string): void {
  const exercises = getExerciseList();
  if (!exercises.includes(exerciseName)) {
    exercises.push(exerciseName);
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(exercises));
  }
}

export function removeExerciseFromList(exerciseName: string): void {
  const exercises = getExerciseList();
  const filtered = exercises.filter((ex) => ex !== exerciseName);
  localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(filtered));
}

export function updateExerciseList(exercises: string[]): void {
  localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(exercises));
}
