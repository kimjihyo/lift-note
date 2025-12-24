"use client";

import { WorkoutForm } from "@/app/workout/_components/workout-form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";

interface WorkoutActivityOverlayProps {
  date: string;
  onClose: () => void;
}

export function WorkoutActivityOverlay({
  date,
  onClose,
}: WorkoutActivityOverlayProps) {
  const formattedDate = format(new Date(date), "MMMM d, yyyy");

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* 헤더 */}
      <header className="shrink-0 px-4 py-3 border-b flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{formattedDate}</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto">
        <WorkoutForm dateOverride={date} />
      </main>
    </div>
  );
}
