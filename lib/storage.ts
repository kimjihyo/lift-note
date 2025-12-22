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

export function initializeDummyData(): void {
  if (typeof window === "undefined") return;

  const existing = getWorkoutRecords();
  if (existing.length > 0) return;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const dummyRecords: WorkoutRecord[] = [
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-03`,
      tags: ["chest", "shoulders"],
      exercises: [
        {
          id: "1",
          name: "Bench Press",
          sets: [
            { id: "1-1", weight: 60, reps: 10 },
            { id: "1-2", weight: 60, reps: 8 },
          ],
        },
        {
          id: "2",
          name: "Incline Bench Press",
          sets: [
            { id: "1-1", weight: 60, reps: 10 },
            { id: "1-2", weight: 60, reps: 8 },
            { id: "1-3", weight: 60, reps: 8 },
            { id: "1-4", weight: 60, reps: 8 },
            { id: "1-5", weight: 60, reps: 8 },
          ],
        },
        {
          id: "3",
          name: "Squat",
          sets: [
            { id: "1-1", weight: 60, reps: 10 },
            { id: "1-2", weight: 60, reps: 8 },
          ],
        },
        {
          id: "4",
          name: "Squat",
          sets: [
            { id: "1-1", weight: 60, reps: 10 },
            { id: "1-2", weight: 60, reps: 8 },
            { id: "1-3", weight: 60, reps: 10 },
            { id: "1-4", weight: 60, reps: 8 },
            { id: "1-5", weight: 60, reps: 10 },
            { id: "1-6", weight: 60, reps: 8 },
            { id: "1-7", weight: 60, reps: 10 },
            { id: "1-8", weight: 60, reps: 8 },
          ],
        },
        {
          id: "5",
          name: "Squat",
          sets: [
            { id: "1-1", weight: 60, reps: 10 },
            { id: "1-2", weight: 60, reps: 8 },
          ],
        },
      ],
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-05`,
      tags: ["legs"],
      exercises: [
        {
          id: "2",
          name: "스쿼트",
          sets: [{ id: "2-1", weight: 100, reps: 5 }],
        },
      ],
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyRecords));
}
