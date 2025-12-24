"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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
import { useVirtualizer } from "@tanstack/react-virtual";
import { getWorkoutRecords } from "@/lib/storage";
import type { WorkoutRecord, WorkoutTag } from "@/lib/types";
import { WorkoutDayCell } from "./workout-day-cell";
import { Button } from "@/components/ui/button";
import { WorkoutActivityOverlay } from "./workout-activity-overlay";
import { Settings } from "lucide-react";
import Link from "next/link";

// 상수
const WEEK_HEIGHT = 96; // 각 주의 높이 (h-24 = 96px)
const MONTH_LABEL_HEIGHT = 36; // 월 레이블 높이 (py-1.5 + text)
const TODAY_MONTH_INDEX = 24; // 오늘 기준 달의 인덱스 (앞뒤 24개월)
const MONTHS_BEFORE = 24; // 과거 달 개수
const MONTHS_AFTER = 24; // 미래 달 개수
const SCROLL_POSITION_KEY = "calendar-scroll-position"; // sessionStorage 키

// 월 데이터 타입
type MonthData = {
  monthDate: Date;
  weeks: Date[][];
};

function formatDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function WorkoutCalendar() {
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const [currentVisibleMonth, setCurrentVisibleMonth] = useState<Date>(
    new Date()
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date())
  );
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  // 현재 달 기준으로 앞뒤 24개월 생성 (총 49개월)
  const monthsData = useMemo<MonthData[]>(() => {
    const months: MonthData[] = [];
    const today = new Date();

    for (let i = -MONTHS_BEFORE; i <= MONTHS_AFTER; i++) {
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
    setWorkoutRecords(getWorkoutRecords());
  }, []);

  const scrollToToday = () => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    // 현재 달(인덱스 24)로 스크롤
    let offset = 0;
    for (let i = 0; i < TODAY_MONTH_INDEX; i++) {
      const weeksCount = monthsData[i]?.weeks.length || 0;
      offset += MONTH_LABEL_HEIGHT + weeksCount * WEEK_HEIGHT;
    }

    scrollElement.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  };

  const getTagsForDate = (day: Date): WorkoutTag[] => {
    const dateStr = formatDate(day);
    const record = workoutRecords.find((r) => r.date === dateStr);
    return record?.tags || [];
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: monthsData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const weeksCount = monthsData[index]?.weeks.length || 0;
      return MONTH_LABEL_HEIGHT + weeksCount * WEEK_HEIGHT;
    },
    initialOffset: () => {
      // sessionStorage에서 저장된 스크롤 위치 복원
      if (typeof window !== "undefined") {
        const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
        if (savedPosition) {
          return parseInt(savedPosition, 10);
        }
      }

      // 저장된 위치가 없으면 현재 달(인덱스 24)로 스크롤
      let offset = 0;
      for (let i = 0; i < TODAY_MONTH_INDEX; i++) {
        const weeksCount = monthsData[i]?.weeks.length || 0;
        offset += MONTH_LABEL_HEIGHT + weeksCount * WEEK_HEIGHT;
      }
      return offset;
    },
  });

  // 스크롤 이벤트로 현재 보이는 월 추적 및 스크롤 위치 저장
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const items = virtualizer.getVirtualItems();
      if (items.length === 0) return;

      // 스크롤 위치 저장
      const scrollTop = scrollElement.scrollTop;
      sessionStorage.setItem(SCROLL_POSITION_KEY, scrollTop.toString());

      // 화면 상단에 가장 가까운 월 찾기
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

    scrollElement.addEventListener("scroll", handleScroll);
    // 초기 월 설정
    handleScroll();

    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [virtualizer, monthsData, currentVisibleMonth]);

  return (
    <>
      <div className="h-full flex flex-col relative">
        {/* 고정 헤더 */}
        <div className="shrink-0 border-b bg-background z-20">
          <div className="py-3 px-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {format(currentVisibleMonth, "MMMM")}
            </h2>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-7 border-t">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={index}
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
                  <div className="px-4 py-1.5">
                    <h3 className="font-semibold text-muted-foreground">
                      {format(monthDate, "MMM")}
                    </h3>
                  </div>

                  {/* 날짜 그리드 */}
                  <div>
                    {weeks.map((week, weekIndex) => (
                      <div
                        key={weekIndex}
                        className="grid grid-cols-7 border-t"
                      >
                        {week.map((day) => {
                          const tags = getTagsForDate(day);
                          const isCurrentMonth = isSameMonth(day, monthDate);
                          const isTodayDate = isToday(day);

                          if (!isCurrentMonth) {
                            return (
                              <div key={day.getDate()} className="p-1 h-24" />
                            );
                          }

                          return (
                            <button
                              key={day.toISOString()}
                              className="p-1 h-24 bg-background rounded-md active:bg-white/5 active:scale-95 transition-[background-color,scale] duration-300"
                              onClick={() => {
                                setSelectedDate(formatDate(day));
                                setIsOverlayOpen(true);
                              }}
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
          className="absolute bottom-4 left-4 rounded-full shadow-lg z-30"
          size="default"
        >
          Today
        </Button>
      </div>

      {/* Activity로 오버레이 관리 */}
      <WorkoutActivityOverlay
        open={isOverlayOpen}
        date={selectedDate}
        onClose={() => setIsOverlayOpen(false)}
      />
    </>
  );
}
