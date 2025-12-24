"use client";

import { useEffect, useRef, useState } from "react";
import {
  getWorkoutRecordByDate,
  saveWorkoutRecord,
  getExerciseList,
  addExerciseToList,
} from "@/lib/storage";
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
import { useSearchParams } from "next/navigation";

const texts = {
  chest: "Chest",
  shoulders: "Delts",
  legs: "Legs",
  arms: "Arms",
  back: "Back",
};

interface WorkoutFormProps {
  dateOverride?: string;
  onMuscleGroupVisibilityChange?: (
    visible: boolean,
    tags: WorkoutTag[]
  ) => void;
}

export function WorkoutForm({
  dateOverride,
  onMuscleGroupVisibilityChange,
}: WorkoutFormProps = {}) {
  const params = useSearchParams();
  const date = dateOverride ?? params.get("date") ?? "";
  const [isLoading, setIsLoading] = useState(true);
  const [record, setRecord] = useState<WorkoutRecord>({
    date,
    tags: [],
    exercises: [],
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");
  const [exerciseList, setExerciseList] = useState<string[]>(() =>
    getExerciseList()
  );

  // 각 운동별 새 세트 입력값 관리
  const [newSetInputs, setNewSetInputs] = useState<
    Record<string, { weight: string; reps: string }>
  >({});

  // muscle group 섹션 ref
  const muscleGroupRef = useRef<HTMLElement>(null);

  // 검색어에 따라 필터링된 운동 목록
  const filteredExercises = exerciseList.filter((exercise) =>
    exercise.toLowerCase().includes(exerciseSearchQuery.toLowerCase())
  );

  // 초기 데이터 로드
  useEffect(() => {
    getWorkoutRecordByDate(date).then((existingRecord) => {
      setIsLoading(false);
      if (existingRecord) {
        setRecord(existingRecord);
      }
    });
  }, [date]);

  // muscle group 섹션 가시성 감지
  useEffect(() => {
    if (!muscleGroupRef.current || !onMuscleGroupVisibilityChange) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onMuscleGroupVisibilityChange(entry.isIntersecting, record.tags);
      },
      {
        threshold: 0,
        rootMargin: "-60px 0px 0px 0px", // 헤더 높이만큼 offset
      }
    );

    observer.observe(muscleGroupRef.current);

    return () => observer.disconnect();
  }, [onMuscleGroupVisibilityChange, record.tags]);

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
    setExerciseSearchQuery("");
  };

  // 새로운 exercise를 목록에 추가하고 workout에도 추가
  const addNewExercise = (exerciseName: string) => {
    const trimmedName = exerciseName.trim();
    if (!trimmedName) return;

    // local storage에 추가
    addExerciseToList(trimmedName);
    // 목록 상태 업데이트
    setExerciseList((prev) => [...prev, trimmedName]);
    // workout에 추가
    addExercise(trimmedName);
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
      <section ref={muscleGroupRef} className="mb-2">
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
        <div className="sticky top-0 z-10 pt-4 bg-background flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Excercises
          </h2>
          <Drawer
            open={isDrawerOpen}
            onOpenChange={(open) => {
              setIsDrawerOpen(open);
              if (!open) setExerciseSearchQuery("");
            }}
          >
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
              <div className="px-4 pb-4 h-[50vh] flex flex-col">
                <Input
                  type="text"
                  placeholder="Search exercises..."
                  value={exerciseSearchQuery}
                  onChange={(e) => setExerciseSearchQuery(e.target.value)}
                  className="mb-3 shrink-0"
                />
                <div className="flex-1 overflow-y-auto">
                  <div className="grid gap-2">
                    {filteredExercises.length > 0 ? (
                      filteredExercises.map((exercise) => (
                        <Button
                          key={exercise}
                          variant="outline"
                          className="justify-start"
                          onClick={() => addExercise(exercise)}
                        >
                          {exercise}
                        </Button>
                      ))
                    ) : exerciseSearchQuery.trim() ? (
                      <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <p className="text-center text-sm text-muted-foreground">
                          No exercises found
                        </p>
                        <Button
                          variant="default"
                          onClick={() => addNewExercise(exerciseSearchQuery)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add &quot;{exerciseSearchQuery.trim()}&quot;
                        </Button>
                      </div>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        Start typing to search or add new exercise
                      </p>
                    )}
                  </div>
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
                <div key={exercise.id}>
                  {/* 운동 헤더 */}
                  <div className="sticky top-12 bg-background pt-3">
                    <div className="bg-background flex flex-col px-3 pt-3 border border-b-0 rounded-t-lg">
                      <div className="flex items-center justify-between pb-2">
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
                      <div className="w-full h-px bg-border" />
                    </div>
                  </div>

                  {/* 세트 리스트 */}
                  <div className="space-y-2 p-3 border border-t-0 border-b-0">
                    {exercise.sets.map((set, index) => (
                      <div key={set.id} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground min-w-9">
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
                          className="h-8 w-18 text-end font-mono font-bold placeholder:font-normal placeholder:text-sm"
                          placeholder="kg"
                        />
                        <span className="text-sm text-muted-foreground">
                          kg
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
                          className="h-8 w-18 text-end font-mono font-bold placeholder:font-normal placeholder:text-sm"
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
                  <div className="flex items-center gap-2 pt-1 px-3 pb-3 border border-t-0 rounded-b-lg">
                    <span className="text-xs text-muted-foreground min-w-9">
                      Set {exercise.sets.length + 1}
                    </span>
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
                      className="h-8 w-18 text-end font-mono font-bold placeholder:font-normal placeholder:text-sm"
                      placeholder="kg"
                    />
                    <span className="text-sm text-muted-foreground">kg</span>
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
                      className="h-8 w-18 text-end font-mono font-bold placeholder:font-normal placeholder:text-sm"
                      placeholder="reps"
                    />
                    <span className="text-sm text-muted-foreground">reps</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-auto"
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
