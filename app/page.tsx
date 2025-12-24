import { WorkoutCalendar } from "./_components/workout-calendar";

export default function Home() {
  return (
    <div className="relative h-full w-full flex flex-col bg-background overflow-hidden">
      <main className="flex-1 overflow-hidden">
        <WorkoutCalendar />
      </main>
    </div>
  );
}
