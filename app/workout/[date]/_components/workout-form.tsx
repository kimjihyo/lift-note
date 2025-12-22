"use client";

import { useEffect, useState } from "react";
import { getWorkoutRecordByDate, saveWorkoutRecord } from "@/lib/storage";
import type {
  WorkoutRecord,
  WorkoutTag,
  Exercise,
  WorkoutSet,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { EXERCISE_LIST } from "@/lib/constants/exercises";

const texts = {
  chest: "Chest",
  shoulders: "Delts",
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 각 운동별 새 세트 입력값 관리
  const [newSetInputs, setNewSetInputs] = useState<
    Record<string, { weight: string; reps: string }>
  >({});

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

  // 운동 추가
  const addExercise = (exerciseName: string) => {
    setRecord((prev) => {
      const newExercise: Exercise = {
        id: `exercise-${Date.now()}`,
        name: exerciseName,
        sets: [],
      };

      const updated = {
        ...prev,
        exercises: [...prev.exercises, newExercise],
      };
      saveWorkoutRecord(updated);
      return updated;
    });

    setIsDrawerOpen(false);
  };

  // 운동 삭제
  const deleteExercise = (exerciseId: string) => {
    setRecord((prev) => {
      const updated = {
        ...prev,
        exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
      };
      saveWorkoutRecord(updated);
      return updated;
    });
  };

  // 세트 추가
  const addSet = (exerciseId: string, weight: number, reps: number) => {
    setRecord((prev) => {
      const newSet: WorkoutSet = {
        id: `set-${Date.now()}`,
        weight,
        reps,
      };

      const updated = {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, sets: [...ex.sets, newSet] } : ex
        ),
      };
      saveWorkoutRecord(updated);
      return updated;
    });
  };

  // 세트 수정
  const updateSet = (
    exerciseId: string,
    setId: string,
    weight: number,
    reps: number
  ) => {
    setRecord((prev) => {
      const updated = {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((set) =>
                  set.id === setId ? { ...set, weight, reps } : set
                ),
              }
            : ex
        ),
      };
      saveWorkoutRecord(updated);
      return updated;
    });
  };

  // 세트 삭제
  const deleteSet = (exerciseId: string, setId: string) => {
    setRecord((prev) => {
      const updated = {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId
            ? { ...ex, sets: ex.sets.filter((set) => set.id !== setId) }
            : ex
        ),
      };
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
        <div className="sticky top-15 z-10 pt-4 bg-background flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Excercises
          </h2>
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger
              asChild
              onClick={(e) => {
                e.currentTarget.blur();
              }}
            >
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
                Add Exercise
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Select Exercise</DrawerTitle>
                <DrawerDescription>
                  Choose an exercise to add to your workout
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
                <div className="grid gap-2">
                  {EXERCISE_LIST.map((exercise) => (
                    <Button
                      key={exercise}
                      variant="outline"
                      className="justify-start"
                      onClick={() => addExercise(exercise)}
                    >
                      {exercise}
                    </Button>
                  ))}
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {!isLoading && record.exercises.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No workout recorded yet. Add one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {record.exercises.map((exercise) => {
              const inputKey = exercise.id;
              const weight = newSetInputs[inputKey]?.weight || "";
              const reps = newSetInputs[inputKey]?.reps || "";

              return (
                <div
                  key={exercise.id}
                  // className="border rounded-lg p-3 space-y-3"
                >
                  {/* 운동 헤더 */}
                  <div className="sticky top-27 bg-background pt-3 border-b">
                    <div className="bg-background flex items-center justify-between px-3 pt-3 pb-2 border border-b-0 rounded-t-lg">
                      <h3 className="font-medium">{exercise.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteExercise(exercise.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 세트 리스트 */}
                  <div className="space-y-2 p-3 border border-t-0 border-b-0">
                    {exercise.sets.map((set, index) => (
                      <div key={set.id} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground min-w-12">
                          Set {index + 1}
                        </span>
                        <Input
                          type="text"
                          pattern="\d*"
                          value={set.weight}
                          onChange={(e) =>
                            updateSet(
                              exercise.id,
                              set.id,
                              parseFloat(e.target.value) || 0,
                              set.reps
                            )
                          }
                          className="h-8 w-16 font-mono font-bold placeholder:font-normal placeholder:text-sm"
                          placeholder="kg"
                        />
                        <span className="text-sm text-muted-foreground">
                          kg ×
                        </span>
                        <Input
                          type="text"
                          pattern="\d*"
                          value={set.reps}
                          onChange={(e) =>
                            updateSet(
                              exercise.id,
                              set.id,
                              set.weight,
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          className="h-8 w-16 font-mono font-bold placeholder:font-normal placeholder:text-sm"
                          placeholder="reps"
                        />
                        <span className="text-sm text-muted-foreground">
                          reps
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive ml-auto"
                          onClick={() => deleteSet(exercise.id, set.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* 세트 추가 입력 */}
                  <div className="flex items-center gap-2 px-3 pb-3 border border-t-0 rounded-b-lg">
                    <Input
                      type="text"
                      pattern="\d*"
                      value={weight}
                      onChange={(e) =>
                        setNewSetInputs((prev) => ({
                          ...prev,
                          [inputKey]: {
                            weight: e.target.value,
                            reps: prev[inputKey]?.reps || "",
                          },
                        }))
                      }
                      className="h-8 w-16 font-mono font-bold placeholder:font-normal placeholder:text-sm"
                      placeholder="kg"
                    />
                    <span className="text-sm text-muted-foreground">kg ×</span>
                    <Input
                      type="text"
                      pattern="\d*"
                      value={reps}
                      onChange={(e) =>
                        setNewSetInputs((prev) => ({
                          ...prev,
                          [inputKey]: {
                            weight: prev[inputKey]?.weight || "",
                            reps: e.target.value,
                          },
                        }))
                      }
                      className="h-8 w-16 font-mono font-bold placeholder:font-normal placeholder:text-sm"
                      placeholder="reps"
                    />
                    <span className="text-sm text-muted-foreground">reps</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 ml-auto"
                      onClick={() => {
                        const w = parseFloat(weight);
                        const r = parseInt(reps, 10);
                        if (!isNaN(w) && !isNaN(r) && w >= 0 && r > 0) {
                          addSet(exercise.id, w, r);
                          setNewSetInputs((prev) => ({
                            ...prev,
                            [inputKey]: { weight: "", reps: "" },
                          }));
                        }
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add Set
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
