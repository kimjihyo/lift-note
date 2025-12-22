import type { WorkoutRecord } from "@/lib/types";

const STORAGE_KEY = "lift-memo-workouts";

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
