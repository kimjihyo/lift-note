"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { getWorkoutRecords, initializeDummyData } from "@/lib/storage";
import type { WorkoutRecord } from "@/lib/types";
import { WorkoutDayCell } from "./workout-day-cell";
import type { DayButton } from "react-day-picker";

export function WorkoutCalendar() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);

  useEffect(() => {
    initializeDummyData();
    setWorkoutRecords(getWorkoutRecords());
  }, []);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(selectedDate);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    router.push(`/workout/${dateStr}`);
  };

  const getTagsForDate = (day: Date): string[] => {
    const dateStr = format(day, "yyyy-MM-dd");
    const record = workoutRecords.find((r) => r.date === dateStr);
    return record?.tags || [];
  };

  const CustomDayButton = ({ day, ...props }: React.ComponentProps<typeof DayButton>) => {
    const tags = getTagsForDate(day.date);
    const isToday = format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    const isSelected = date && format(day.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

    return (
      <button {...props} className={props.className}>
        <WorkoutDayCell
          day={day.date.getDate()}
          tags={tags as any}
          isToday={isToday}
          isSelected={isSelected}
        />
      </button>
    );
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      className="w-full h-full flex flex-col"
      components={{
        DayButton: CustomDayButton,
      }}
    />
  );
}
