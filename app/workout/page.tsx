import { WorkoutForm } from "./_components/workout-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { WorkoutHeader } from "./_components/workout-header";

export default async function WorkoutPage() {
  return (
    <div className="flex flex-col bg-background">
      {/* 헤더 */}
      <header className="bg-background sticky z-20 top-0 shrink-0 px-4 py-3 border-b flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <Suspense>
            <WorkoutHeader />
          </Suspense>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <Suspense>
          <WorkoutForm />
        </Suspense>
      </main>
    </div>
  );
}
