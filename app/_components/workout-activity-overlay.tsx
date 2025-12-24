"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";
import { WorkoutForm } from "./workout-form";
import { Activity, useEffect, useRef, useState } from "react";
import type { WorkoutTag } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface WorkoutActivityOverlayProps {
  date: string;
  open: boolean;
  onClose: () => void;
}

const durationMs = 320;

const texts = {
  chest: "Chest",
  shoulders: "Delts",
  legs: "Legs",
  arms: "Arms",
  back: "Back",
};

export function WorkoutActivityOverlay({
  date,
  open,
  onClose,
}: WorkoutActivityOverlayProps) {
  const formattedDate = format(new Date(date), "MMMM d, yyyy");

  // Activity mode는 "실제 표시/숨김"
  const [mode, setMode] = useState<"visible" | "hidden">(
    open ? "visible" : "hidden"
  );

  // 애니메이션 상태(래퍼에 클래스/스타일 적용)
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("idle");

  // muscle group 가시성 상태
  const [isMuscleGroupVisible, setIsMuscleGroupVisible] = useState(true);
  const [muscleGroupTags, setMuscleGroupTags] = useState<WorkoutTag[]>([]);

  const timeoutRef = useRef<number | null>(null);

  const rafRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    rafRef.current = null;
    timeoutRef.current = null;
  };

  const handleMuscleGroupVisibilityChange = (
    visible: boolean,
    tags: WorkoutTag[]
  ) => {
    setIsMuscleGroupVisible(visible);
    setMuscleGroupTags(tags);
  };

  useEffect(() => {
    clearTimers();

    if (open) {
      // effect 본문에서 setState를 바로 하지 말고, 콜백으로 밀어넣기
      queueMicrotask(() => {
        setMode("visible");

        // enter 트랜지션 트리거
        rafRef.current = requestAnimationFrame(() => {
          setPhase("enter");

          timeoutRef.current = window.setTimeout(() => {
            setPhase("idle");
          }, durationMs);
        });
      });
    } else {
      // exit 먼저
      queueMicrotask(() => {
        setPhase("exit");

        // exit 끝나면 실제 숨김
        timeoutRef.current = window.setTimeout(() => {
          setMode("hidden");
        }, durationMs);
      });
    }

    return clearTimers;
  }, [open]);

  return (
    <Activity mode={mode}>
      <div
        className="absolute top-0 left-0 w-full h-full overflow-y-auto z-50 bg-background flex flex-col"
        style={{
          transition: `opacity ${durationMs}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${durationMs}ms cubic-bezier(0.33, 1, 0.68, 1)`,
          transform: phase === "exit" ? "translateY(100%)" : "translateY(0px)",
        }}
      >
        {/* 헤더 */}
        <header className="bg-background shrink-0 px-4 h-15 border-b flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{formattedDate}</h1>
            {!isMuscleGroupVisible && muscleGroupTags.length > 0 && (
              <div className="flex gap-1">
                {muscleGroupTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {texts[tag]}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <WorkoutForm
            dateOverride={date}
            onMuscleGroupVisibilityChange={handleMuscleGroupVisibilityChange}
          />
        </main>
      </div>
    </Activity>
  );
}
