"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import DocumentDetail from "@/components/document/DocumentDetail";
import type { DocumentDetailProps } from "@/components/document/DocumentDetail";
import { AccessibilityProvider } from "@/contexts/AccessibilityProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

interface DocPreviewClientProps extends DocumentDetailProps {
  displayName?: string;
}


export default function DocPreviewClient({
  displayName,
  ...documentProps
}: DocPreviewClientProps) {
  const router = useRouter();

  useEffect(() => {
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, []);

  return (
    <AccessibilityProvider>
      <TooltipProvider>
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Close preview"
            className="absolute right-4 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>

          <header className="flex flex-col items-center justify-center border-b px-6 pt-8 pb-4 text-center sm:px-10">
            <span className="text-base font-semibold text-slate-900">
              {displayName ?? 'Document Preview'}
            </span>
            <span className="text-xs text-slate-500">Read-only snapshot</span>
          </header>

          <main className="flex-1 overflow-auto bg-white sm:bg-slate-100/80 sm:px-6 sm:py-4">
            <div className="mx-auto w-full max-w-[700px] sm:max-w-[760px] md:max-w-[840px] px-4 pb-6 sm:px-0">
            <DocumentDetail {...documentProps} showClauseIcons={false} />
            </div>
          </main>
        </div>
      </TooltipProvider>
    </AccessibilityProvider>
  );
}
