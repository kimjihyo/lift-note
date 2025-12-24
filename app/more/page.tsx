"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Upload, Trash2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { getWorkoutRecords, getExerciseList } from "@/lib/storage";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProgressDrawerOpen, setIsProgressDrawerOpen] = useState(false);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");
  const [exerciseList] = useState<string[]>(() => getExerciseList());

  const handleBackup = () => {
    // 운동 기록과 운동 목록 가져오기
    const workouts = getWorkoutRecords();
    const exercises = getExerciseList();

    // 백업 데이터 구조
    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      data: {
        workouts,
        exercises,
      },
    };

    // JSON 파일로 다운로드
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lift-note-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);

        // 데이터 검증
        if (
          !backupData.data ||
          !backupData.data.workouts ||
          !backupData.data.exercises
        ) {
          alert("Invalid backup file format");
          return;
        }

        // local storage에 복원
        localStorage.setItem(
          "lift-memo-workouts",
          JSON.stringify(backupData.data.workouts)
        );
        localStorage.setItem(
          "lift-memo-exercises",
          JSON.stringify(backupData.data.exercises)
        );

        alert("Data restored successfully! Please refresh the page.");
        // 페이지 새로고침
        window.location.href = "/";
      } catch (error) {
        console.error("Failed to restore data:", error);
        alert("Failed to restore data. Please check the file.");
      }
    };

    reader.readAsText(file);
    // input 초기화
    event.target.value = "";
  };

  const handleClearData = () => {
    // local storage에서 모든 데이터 삭제
    localStorage.removeItem("lift-memo-workouts");
    localStorage.removeItem("lift-memo-exercises");

    setIsDialogOpen(false);
    alert("All data has been cleared successfully!");
    // 페이지 새로고침
    window.location.href = "/";
  };

  const handleSelectExercise = (exerciseName: string) => {
    setIsProgressDrawerOpen(false);
    setExerciseSearchQuery("");
    router.push(`/progress/${encodeURIComponent(exerciseName)}`);
  };

  // 검색어에 따라 필터링된 운동 목록
  const filteredExercises = exerciseList.filter((exercise) =>
    exercise.toLowerCase().includes(exerciseSearchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* 헤더 */}
      <header className="shrink-0 px-4 h-15 border-b flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">More</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto p-4">
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold mb-3">Progress</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Track your strength progress over time
            </p>
          </div>

          <Button
            onClick={() => setIsProgressDrawerOpen(true)}
            className="w-full justify-start"
            variant="outline"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Exercise Progress
          </Button>
        </section>

        <section className="space-y-4 mt-8">
          <div>
            <h2 className="text-base font-semibold mb-3">Data Management</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Backup and restore your workout data
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleBackup}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Backup Data
            </Button>

            <Button
              onClick={handleRestore}
              className="w-full justify-start"
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Restore Data
            </Button>

            {/* 숨겨진 파일 input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Backup creates a JSON file with all your
              workout records and exercise library. Restore will replace all
              current data with the backup file.
            </p>
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <div>
            <h2 className="text-base font-semibold mb-3">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete all your data
            </p>
          </div>

          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full justify-start"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </section>
      </main>

      {/* 확인 다이얼로그 */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your workout records and exercise library from your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData}>
              Delete All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 운동 선택 Drawer */}
      <Drawer
        open={isProgressDrawerOpen}
        onOpenChange={(open) => {
          setIsProgressDrawerOpen(open);
          if (!open) setExerciseSearchQuery("");
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Exercise</DrawerTitle>
            <DrawerDescription>
              Choose an exercise to view progress
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
                      onClick={() => handleSelectExercise(exercise)}
                    >
                      {exercise}
                    </Button>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No exercises found
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
  );
}
