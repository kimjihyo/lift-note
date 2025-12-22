import type { WorkoutTag } from "@/lib/types";

export const TAG_COLORS: Record<
  WorkoutTag,
  { bg: string; text: string; border: string }
> = {
  chest: {
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-300 dark:border-red-700",
  },
  back: {
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-700",
  },
  shoulders: {
    bg: "bg-orange-100 dark:bg-orange-950",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-300 dark:border-orange-700",
  },
  legs: {
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-300 dark:border-green-700",
  },
  arms: {
    bg: "bg-purple-100 dark:bg-purple-950",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-700",
  },
};

export function getTagColor(tag: WorkoutTag) {
  return TAG_COLORS[tag];
}
