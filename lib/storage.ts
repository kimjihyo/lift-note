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

export function getWorkoutRecordByDate(date: string): WorkoutRecord | null {
  const records = getWorkoutRecords();
  return records.find((record) => record.date === date) || null;
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
      tags: ["가슴", "어깨"],
      exercises: [
        {
          id: "1",
          name: "벤치프레스",
          sets: [
            { id: "1-1", weight: 60, reps: 10 },
            { id: "1-2", weight: 60, reps: 8 },
          ],
        },
      ],
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-05`,
      tags: ["하체"],
      exercises: [
        {
          id: "2",
          name: "스쿼트",
          sets: [{ id: "2-1", weight: 100, reps: 5 }],
        },
      ],
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-08`,
      tags: ["등"],
      exercises: [
        {
          id: "3",
          name: "데드리프트",
          sets: [{ id: "3-1", weight: 120, reps: 5 }],
        },
      ],
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-12`,
      tags: ["가슴", "팔"],
      exercises: [
        {
          id: "4",
          name: "덤벨프레스",
          sets: [{ id: "4-1", weight: 30, reps: 12 }],
        },
      ],
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-15`,
      tags: ["어깨", "팔"],
      exercises: [
        {
          id: "5",
          name: "숄더프레스",
          sets: [{ id: "5-1", weight: 25, reps: 10 }],
        },
      ],
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-18`,
      tags: ["하체", "가슴"],
      exercises: [
        {
          id: "6",
          name: "레그프레스",
          sets: [{ id: "6-1", weight: 150, reps: 12 }],
        },
      ],
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyRecords));
}
