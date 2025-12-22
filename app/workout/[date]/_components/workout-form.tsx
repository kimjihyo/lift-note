"use client";

import { useEffect, useState } from "react";
import { getWorkoutRecordByDate, saveWorkoutRecord } from "@/lib/storage";
import type { WorkoutRecord, WorkoutTag, Exercise } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WorkoutFormProps {
  date: string;
}

export function WorkoutForm({ date }: WorkoutFormProps) {
  const [record, setRecord] = useState<WorkoutRecord>({
    date,
    tags: [],
    exercises: [],
  });

  // 초기 데이터 로드
  useEffect(() => {
    const existingRecord = getWorkoutRecordByDate(date);
    if (existingRecord) {
      setRecord(existingRecord);
    }
  }, [date]);

  // 데이터 저장
  const handleSave = () => {
    saveWorkoutRecord(record);
  };

  // 태그 토글
  const toggleTag = (tag: WorkoutTag) => {
    setRecord((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      const updated = { ...prev, tags: newTags };
      saveWorkoutRecord(updated);
      return updated;
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* 태그 선택 섹션 */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          운동 부위
        </h2>
        <div className="flex flex-wrap gap-2">
          {(["가슴", "등", "어깨", "하체", "팔"] as WorkoutTag[]).map(
            (tag) => (
              <Button
                key={tag}
                variant={record.tags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Button>
            )
          )}
        </div>
      </section>

      {/* 운동 목록 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            운동 목록
          </h2>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            운동 추가
          </Button>
        </div>

        {record.exercises.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">운동을 추가해주세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {record.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <h3 className="font-medium">{exercise.name}</h3>
                <div className="space-y-1">
                  {exercise.sets.map((set, index) => (
                    <div
                      key={set.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-muted-foreground w-8">
                        {index + 1}세트
                      </span>
                      <span>
                        {set.weight}kg × {set.reps}회
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
