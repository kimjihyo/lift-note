"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isToday, startOfWeek, endOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { getWorkoutRecords, initializeDummyData } from "@/lib/storage";
import type { WorkoutRecord } from "@/lib/types";
import { WorkoutDayCell } from "./workout-day-cell";

export function WorkoutCalendar() {
  const router = useRouter();
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const [visibleMonths, setVisibleMonths] = useState<Date[]>([
    subMonths(new Date(), 1),
    new Date(),
    addMonths(new Date(), 1),
  ]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    initializeDummyData();
    setWorkoutRecords(getWorkoutRecords());
  }, []);

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    router.push(`/workout/${dateStr}`);
  };

  const getTagsForDate = (day: Date): string[] => {
    const dateStr = format(day, "yyyy-MM-dd");
    const record = workoutRecords.find((r) => r.date === dateStr);
    return record?.tags || [];
  };

  const handleScroll = () => {
    if (isScrolling || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // 상단 근처로 스크롤 시 이전 달 추가
    if (scrollTop < 200) {
      setIsScrolling(true);
      setVisibleMonths((prev) => [subMonths(prev[0], 1), ...prev]);
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollTop + 400;
        }
        setIsScrolling(false);
      }, 0);
    }
    // 하단 근처로 스크롤 시 다음 달 추가
    else if (scrollTop + clientHeight > scrollHeight - 200) {
      setIsScrolling(true);
      setVisibleMonths((prev) => [...prev, addMonths(prev[prev.length - 1], 1)]);
      setTimeout(() => setIsScrolling(false), 0);
    }
  };

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div key={monthDate.toISOString()} className="mb-4">
        <div className="px-4 py-2 sticky top-0 bg-background z-10">
          <h2 className="text-lg font-semibold">
            {format(monthDate, "yyyy년 M월", { locale: ko })}
          </h2>
        </div>

        <div className="px-2">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div
                key={day}
                className="text-center text-xs text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day) => {
                  const tags = getTagsForDate(day);
                  const isCurrentMonth = isSameMonth(day, monthDate);
                  const isTodayDate = isToday(day);

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={`border rounded-md p-1 min-h-20 ${
                        isCurrentMonth ? "bg-background" : "bg-muted/30"
                      } ${isTodayDate ? "border-primary border-2" : "border-border"}`}
                    >
                      <WorkoutDayCell
                        day={day.getDate()}
                        tags={tags as any}
                        isToday={isTodayDate}
                        isCurrentMonth={isCurrentMonth}
                      />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto"
    >
      {visibleMonths.map((monthDate) => renderMonth(monthDate))}
    </div>
  );
}
