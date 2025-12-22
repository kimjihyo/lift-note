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
import { Button } from "@/components/ui/button";

// 월 데이터 타입
type MonthData = {
  monthDate: Date;
  weeks: Date[][];
};

export function WorkoutCalendar() {
  const router = useRouter();
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const [currentVisibleMonth, setCurrentVisibleMonth] = useState<Date>(new Date());
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

  const scrollToToday = () => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    // 현재 달(인덱스 24)로 스크롤
    let offset = 0;
    const WEEK_HEIGHT = 80;
    const MONTH_LABEL_HEIGHT = 28;
    for (let i = 0; i < 24; i++) {
      const weeksCount = monthsData[i]?.weeks.length || 0;
      offset += MONTH_LABEL_HEIGHT + weeksCount * WEEK_HEIGHT;
    }

    scrollElement.scrollTo({
      top: offset,
      behavior: "smooth",
    });
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
      const WEEK_HEIGHT = 80;
      const MONTH_LABEL_HEIGHT = 28; // py-1.5 (6px * 2) + text height (16px)
      return MONTH_LABEL_HEIGHT + weeksCount * WEEK_HEIGHT;
    },
    initialOffset: () => {
      // 현재 달(인덱스 24)로 스크롤
      let offset = 0;
      const WEEK_HEIGHT = 80;
      const MONTH_LABEL_HEIGHT = 28;
      for (let i = 0; i < 24; i++) {
        const weeksCount = monthsData[i]?.weeks.length || 0;
        offset += MONTH_LABEL_HEIGHT + weeksCount * WEEK_HEIGHT;
      }
      return offset;
    },
  });

  // 스크롤 이벤트로 현재 보이는 월 추적
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const items = virtualizer.getVirtualItems();
      if (items.length === 0) return;

      // 화면 상단에 가장 가까운 월 찾기
      const scrollTop = scrollElement.scrollTop;
      const containerHeight = scrollElement.clientHeight;
      const viewportTop = scrollTop;
      const viewportBottom = scrollTop + containerHeight;
      const viewportCenter = scrollTop + containerHeight / 3; // 상단 1/3 지점 사용

      // 가장 많이 보이는 월 찾기
      let maxVisibleArea = 0;
      let bestIndex = items[0].index;

      for (const item of items) {
        const itemTop = item.start;
        const itemBottom = item.end;

        // 뷰포트와 아이템의 교차 영역 계산
        const visibleTop = Math.max(viewportTop, itemTop);
        const visibleBottom = Math.min(viewportBottom, itemBottom);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);

        // 교차 영역이 가장 큰 아이템이 현재 보이는 월
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          bestIndex = item.index;
        }

        // 뷰포트 중앙(상단 1/3)이 이 아이템 안에 있으면 이것을 선택
        if (itemTop <= viewportCenter && itemBottom >= viewportCenter) {
          bestIndex = item.index;
          break;
        }
      }

      const monthDate = monthsData[bestIndex]?.monthDate;
      if (monthDate && monthDate.getTime() !== currentVisibleMonth.getTime()) {
        setCurrentVisibleMonth(monthDate);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    // 초기 월 설정
    handleScroll();

    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [virtualizer, monthsData, currentVisibleMonth]);

  return (
    <div className="h-full flex flex-col relative">
      {/* 고정 헤더 */}
      <div className="shrink-0 border-b bg-background z-20">
        <div className="py-3 px-2">
          <h2 className="text-lg font-semibold">
            {format(currentVisibleMonth, "yyyy년 M월", { locale: ko })}
          </h2>
        </div>
        <div className="grid grid-cols-7 border-t">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div
              key={day}
              className="text-center text-xs text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* 가상화된 달력 콘텐츠 */}
      <div ref={parentRef} className="flex-1 overflow-y-auto">
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
                {/* 달 레이블 */}
                <div className="px-2 py-1.5">
                  <h3 className="text-xs font-semibold text-muted-foreground">
                    {format(monthDate, "M월", { locale: ko })}
                  </h3>
                </div>

                {/* 날짜 그리드 */}
                <div>
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 border-t">
                      {week.map((day) => {
                        const tags = getTagsForDate(day);
                        const isCurrentMonth = isSameMonth(day, monthDate);
                        const isTodayDate = isToday(day);

                        return (
                          <button
                            key={day.toISOString()}
                            onClick={() => handleDateClick(day)}
                            className="p-1 min-h-20 bg-background"
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

      {/* Today 플로팅 버튼 */}
      <Button
        onClick={scrollToToday}
        className="fixed bottom-4 left-4 rounded-full shadow-lg z-30"
        size="default"
      >
        Today
      </Button>
    </div>
  );
}
