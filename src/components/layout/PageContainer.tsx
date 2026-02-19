"use client";

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({
  children,
  className,
  noPadding,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "min-h-screen pb-20",
        !noPadding && "px-4 pt-4",
        className
      )}
    >
      <div className="mx-auto max-w-lg">{children}</div>
    </main>
  );
}
