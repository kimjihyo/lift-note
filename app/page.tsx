import { WorkoutCalendar } from "./_components/workout-calendar";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="shrink-0 px-4 py-3 border-b">
        <h1 className="text-xl font-bold tracking-tight">Lift Log</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <WorkoutCalendar />
      </main>
    </div>
  );
}
