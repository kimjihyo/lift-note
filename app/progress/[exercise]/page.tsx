"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useWorkoutRecords } from "@/lib/hooks/use-workout-records";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

type ProgressDataPoint = {
  date: string;
  maxWeight: number;
  totalVolume: number;
};

export default function ExerciseProgressPage() {
  const params = useParams();
  const exerciseName = decodeURIComponent(params.exercise as string);
  const workoutRecords = useWorkoutRecords();

  // 선택한 운동의 진행 상황 데이터 계산
  const progressData = useMemo<ProgressDataPoint[]>(() => {
    const dataMap = new Map<string, ProgressDataPoint>();

    workoutRecords.forEach((record) => {
      const exercise = record.exercises.find((ex) => ex.name === exerciseName);
      if (!exercise || exercise.sets.length === 0) return;

      // 해당 날짜의 최대 무게 계산
      const maxWeight = Math.max(...exercise.sets.map((set) => set.weight));

      // 해당 날짜의 총 볼륨 계산 (무게 × 횟수의 합)
      const totalVolume = exercise.sets.reduce(
        (sum, set) => sum + set.weight * set.reps,
        0
      );

      dataMap.set(record.date, {
        date: record.date,
        maxWeight,
        totalVolume,
      });
    });

    // 날짜순으로 정렬
    return Array.from(dataMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [workoutRecords, exerciseName]);

  const chartConfig = {
    maxWeight: {
      label: "Max Weight",
      color: "hsl(220, 70%, 50%)",
    },
  } satisfies ChartConfig;

  const hasData = progressData.length > 0;

  return (
    <div className="h-dvh w-full flex flex-col bg-background">
      {/* 헤더 */}
      <header className="shrink-0 px-4 h-15 border-b flex items-center gap-3">
        <Link href="/more">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">{exerciseName}</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto p-4">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">
              No workout data found for {exerciseName}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Max Weight Progress</CardTitle>
                <CardDescription>
                  Track your maximum weight over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-75 w-full">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        format(parseISO(value), "MMM d")
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      domain={["dataMin - 5", "dataMax + 5"]}
                      label={{
                        value: "Weight (kg)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) =>
                            format(parseISO(value as string), "MMM d, yyyy")
                          }
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="maxWeight"
                      stroke="hsl(220, 70%, 50%)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "hsl(220, 70%, 50%)" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* 통계 요약 */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Current Max</CardDescription>
                  <CardTitle className="text-2xl">
                    {progressData[progressData.length - 1].maxWeight} kg
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>All-Time Max</CardDescription>
                  <CardTitle className="text-2xl">
                    {Math.max(...progressData.map((d) => d.maxWeight))} kg
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
