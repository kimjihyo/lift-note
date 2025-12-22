import { Badge } from "@/components/ui/badge";
import { getTagColor } from "@/lib/constants/tag-colors";
import type { WorkoutTag } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WorkoutDayCellProps {
  day: number;
  tags: WorkoutTag[];
  isSelected?: boolean;
  isToday?: boolean;
}

export function WorkoutDayCell({
  day,
  tags,
  isSelected,
  isToday,
}: WorkoutDayCellProps) {
  return (
    <div className="flex h-full w-full flex-col items-start justify-start p-1 gap-0.5">
      <span
        className={cn(
          "text-sm font-medium",
          isToday && "font-bold",
          isSelected && "text-primary-foreground"
        )}
      >
        {day}
      </span>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-0.5 w-full">
          {tags.map((tag) => {
            const colors = getTagColor(tag);
            return (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center rounded-sm px-1 py-0.5 text-[0.65rem] font-medium border",
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
