import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* 헤더 */}
      <header className="shrink-0 px-4 h-15 border-b flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto p-4">
        <p className="text-muted-foreground text-sm">
          Settings page - To be implemented
        </p>
      </main>
    </div>
  );
}
