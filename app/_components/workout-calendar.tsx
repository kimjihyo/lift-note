"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getWorkoutRecords, initializeDummyData } from "@/lib/storage";
import type { WorkoutRecord, WorkoutTag } from "@/lib/types";
import { WorkoutDayCell } from "./workout-day-cell";

// 월 데이터 타입
type MonthData = {
  monthDate: Date;
  weeks: Date[][];
};

export function WorkoutCalendar() {
  const router = useRouter();
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);

  // 현재 달 기준으로 앞뒤 24개월 생성 (총 49개월)
  const monthsData = useMemo<MonthData[]>(() => {
    const months: MonthData[] = [];
    const today = new Date();

    for (let i = -24; i <= 24; i++) {
      const monthDate = addMonths(today, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
      const days = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
      });

      const weeks: Date[][] = [];
      for (let j = 0; j < days.length; j += 7) {
        weeks.push(days.slice(j, j + 7));
      }

      months.push({ monthDate, weeks });
    }

    return months;
  }, []);

  useEffect(() => {
    initializeDummyData();
    setWorkoutRecords(getWorkoutRecords());
  }, []);

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    router.push(`/workout/${dateStr}`);
  };

  const getTagsForDate = (day: Date): WorkoutTag[] => {
    const dateStr = format(day, "yyyy-MM-dd");
    const record = workoutRecords.find((r) => r.date === dateStr);
    return record?.tags || [];
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: monthsData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const weeksCount = monthsData[index]?.weeks.length || 0;
      const HEADER_HEIGHT = 48;
      const WEEKDAY_HEADER_HEIGHT = 32;
      const WEEK_HEIGHT = 88;
      const BOTTOM_MARGIN = 16;
      return (
        HEADER_HEIGHT +
        WEEKDAY_HEADER_HEIGHT +
        weeksCount * WEEK_HEIGHT +
        BOTTOM_MARGIN
      );
    },
    initialOffset: () => {
      // 현재 달(인덱스 24)로 스크롤
      let offset = 0;
      for (let i = 0; i < 24; i++) {
        const weeksCount = monthsData[i]?.weeks.length || 0;
        offset += 48 + 32 + weeksCount * 88 + 16;
      }
      return offset;
    },
  });

  return (
    <div ref={parentRef} className="h-full overflow-y-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const { monthDate, weeks } = monthsData[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {/* 월 헤더 */}
              <div className="py-3 px-2">
                <h2 className="text-lg font-semibold">
                  {format(monthDate, "yyyy년 M월", { locale: ko })}
                </h2>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 mb-1">
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
              <div>
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7">
                    {week.map((day) => {
                      const tags = getTagsForDate(day);
                      const isCurrentMonth = isSameMonth(day, monthDate);
                      const isTodayDate = isToday(day);

                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => handleDateClick(day)}
                          className={`p-1 min-h-20 ${
                            isCurrentMonth ? "bg-background" : "bg-muted/30"
                          }`}
                        >
                          <WorkoutDayCell
                            day={day.getDate()}
                            tags={tags}
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
          );
        })}
      </div>
    </div>
  );
}
