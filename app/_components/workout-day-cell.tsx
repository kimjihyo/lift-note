import { getTagColor } from "@/lib/constants/tag-colors";
import type { WorkoutTag } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WorkoutDayCellProps {
  day: number;
  tags: WorkoutTag[];
  isToday?: boolean;
  isCurrentMonth?: boolean;
}

export function WorkoutDayCell({
  day,
  tags,
  isToday,
  isCurrentMonth,
}: WorkoutDayCellProps) {
  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-1">
      <span
        className={cn(
          "text-sm font-medium w-full text-left",
          isToday && "font-bold text-primary",
          !isCurrentMonth && "text-muted-foreground"
        )}
      >
        {day}
      </span>
      {tags.length > 0 && (
        <div className="flex flex-col gap-0.5 w-full">
          {tags.map((tag) => {
            const colors = getTagColor(tag);
            return (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center justify-center rounded-sm px-1.5 py-0.5 text-[0.65rem] font-medium border w-full",
                  colors.bg,
                  colors.text,
                  colors.border
                )}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
