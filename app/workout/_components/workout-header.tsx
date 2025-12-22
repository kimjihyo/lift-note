"use client";

import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

export function WorkoutHeader() {
  const params = useSearchParams();
  const date = params.get("date");

  if (!date) return null;

  const dateObj = new Date(date);
  const formattedDate = format(dateObj, "MMMM do");

  return <h1 className="text-lg font-semibold">{formattedDate}</h1>;
}
