"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";
import { WorkoutForm } from "./workout-form";

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
    <div className="absolute top-0 left-0 w-full h-full overflow-y-auto z-50 bg-background flex flex-col">
      {/* 헤더 */}
      <header className="bg-background shrink-0 px-4 h-15 border-b flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{formattedDate}</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 min-h-0 overflow-y-auto">
        <WorkoutForm dateOverride={date} />
      </main>
    </div>
  );
}
