import { useMemo, useSyncExternalStore } from "react";
import type { WorkoutRecord } from "@/lib/types";

const STORAGE_KEY = "lift-memo-workouts";
const WORKOUT_RECORDS_CHANGED_EVENT = "workoutRecordsChanged";

// subscribe 함수: 스토어 변경을 구독
function subscribe(callback: () => void) {
  // 같은 탭 내 변경 감지
  window.addEventListener(WORKOUT_RECORDS_CHANGED_EVENT, callback);

  // 다른 탭/창 변경 감지
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(WORKOUT_RECORDS_CHANGED_EVENT, callback);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

// getSnapshot 함수: localStorage에서 JSON string 직접 반환 (참조 비교를 위해)
function getSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(STORAGE_KEY) || "[]";
}

// getServerSnapshot 함수: SSR 시 초기값 반환
function getServerSnapshot(): string {
  return "[]";
}

// workoutRecords를 자동으로 동기화하는 커스텀 훅
export function useWorkoutRecords(): WorkoutRecord[] {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return useMemo(() => JSON.parse(snapshot), [snapshot]);
}
