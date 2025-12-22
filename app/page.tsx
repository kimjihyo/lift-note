import { WorkoutCalendar } from "./_components/workout-calendar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">운동 기록</h1>
          <p className="text-muted-foreground mt-2">
            날짜를 선택하여 운동 기록을 관리하세요
          </p>
        </div>

        <div className="flex justify-center">
          <WorkoutCalendar />
        </div>
      </main>
    </div>
  );
}
