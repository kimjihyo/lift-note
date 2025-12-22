"use client";

import { useEffect, useState } from "react";
import { getWorkoutRecordByDate, saveWorkoutRecord } from "@/lib/storage";
import type { WorkoutRecord, WorkoutTag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const texts = {
  chest: "Chest",
  shoulders: "Shoulders",
  legs: "Legs",
  arms: "Arms",
  back: "Back",
};

interface WorkoutFormProps {
  date: string;
}

export function WorkoutForm({ date }: WorkoutFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [record, setRecord] = useState<WorkoutRecord>({
    date,
    tags: [],
    exercises: [],
  });

  // 초기 데이터 로드
  useEffect(() => {
    getWorkoutRecordByDate(date).then((existingRecord) => {
      setIsLoading(false);
      if (existingRecord) {
        setRecord(existingRecord);
      }
    });
  }, [date]);

  // 태그 토글
  const setTags = (tags: WorkoutTag[]) => {
    setRecord((prev) => {
      const updated = { ...prev, tags };
      saveWorkoutRecord(updated);
      return updated;
    });
  };

  return (
    <div className="p-4">
      {/* 태그 선택 섹션 */}
      <section className="mb-2">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          Muscle Group
        </h2>
        <ToggleGroup
          type="multiple"
          value={record.tags}
          spacing={2}
          onValueChange={setTags}
          className="flex-wrap"
        >
          {(["chest", "back", "shoulders", "legs", "arms"] as WorkoutTag[]).map(
            (tag) => (
              <ToggleGroupItem key={tag} value={tag}>
                {texts[tag]}
              </ToggleGroupItem>
            )
          )}
        </ToggleGroup>
      </section>

      {/* 운동 목록 섹션 */}
      <section>
        <div className="sticky top-15 pt-4 bg-background flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Excercises
          </h2>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Exercise
          </Button>
        </div>

        {!isLoading && record.exercises.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No workout recorded yet. Add one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {record.exercises.map((exercise) => (
              <div key={exercise.id}>
                <h3 className="font-medium pb-1 mb-2 border-b">
                  {exercise.name}
                </h3>
                <div className="space-y-1">
                  {exercise.sets.map((set, index) => (
                    <div
                      key={set.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-muted-foreground min-w-12">
                        Set {index + 1}
                      </span>
                      <span>
                        <span className="font-mono font-bold">
                          {set.weight}
                        </span>
                        kg ×{" "}
                        <span className="font-mono font-bold">{set.reps}</span>
                        reps
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
