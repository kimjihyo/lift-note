import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkoutForm } from "./_components/workout-form";

interface WorkoutPageProps {
  params: Promise<{
    date: string;
  }>;
}

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { date } = await params;

  // date 형식 검증
  const dateObj = new Date(date);
  const formattedDate = format(dateObj, "yyyy년 M월 d일 (E)", { locale: ko });

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <header className="shrink-0 px-4 py-3 border-b flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold">{formattedDate}</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto">
        <WorkoutForm date={date} />
      </main>
    </div>
  );
}
