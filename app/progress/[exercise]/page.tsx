"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ExerciseProgressPage() {
  const params = useParams();
  const exerciseName = decodeURIComponent(params.exercise as string);

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* 헤더 */}
      <header className="shrink-0 px-4 h-15 border-b flex items-center gap-3">
        <Link href="/more">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">{exerciseName}</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            Progress tracking coming soon...
          </p>
        </div>
      </main>
    </div>
  );
}
