"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export function WorkoutCalendar() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(selectedDate);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    router.push(`/workout/${dateStr}`);
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      className="rounded-md border"
    />
  );
}
