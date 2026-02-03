'use client';

import React, { forwardRef, useState } from 'react';
import { ExternalLink, Loader2, Mic, Navigation, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/shadcn/utils';



interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = forwardRef<
  HTMLDivElement,
  WelcomeViewProps & React.ComponentProps<'div'>
>(({ startButtonText, onStartCall, className, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    onStartCall();
  };

  return (
    <div
      ref={ref}
      className={cn(
        'bg-background text-foreground flex h-svh w-full flex-col items-center justify-center overflow-hidden px-6',
        className
      )}
      {...props}
    >
      <div className="flex w-full max-w-2xl flex-col items-center justify-center text-center">
        {/* 1. Brand Section */}
        <div className="relative mb-12 flex flex-col items-center justify-center">
          <div className="bg-primary/5 absolute h-40 w-40 animate-pulse rounded-full blur-[80px]" />

          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Echo Vision
          </h1>
          <p className="max-w-md text-base font-medium leading-relaxed tracking-wide text-slate-400">
            Empowering Vision Beyond Sight
          </p>
        </div>

        {/* 5. Minimal Feature Hints */}
        <div className="mb-16 flex flex-wrap justify-center gap-x-12 gap-y-4 opacity-30 transition-opacity duration-300 hover:opacity-50">
          <div className="flex items-center gap-2 text-[10px] font-medium tracking-wider uppercase">
            <Mic className="size-3" />
            Real-time Voice Assistance
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium tracking-wider uppercase">
            <Navigation className="size-3" />
            Smart Navigation Support
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium tracking-wider uppercase">
            <ShieldCheck className="size-3" />
            Privacy by Design
          </div>
        </div>

        {/* 2 & 3. Primary & Secondary CTA */}
        <div className="flex w-full flex-col items-center gap-6">
          <Button
            size="lg"
            onClick={handleStart}
            disabled={isLoading}
            className="bg-primary h-14 w-full max-w-[280px] rounded-full text-base font-semibold tracking-wide text-black transition-all duration-200 hover:scale-[1.02] hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {isLoading ? 'Initializing...' : startButtonText}
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-primary/50 text-primary hover:border-primary hover:bg-primary/10 hover:text-primary h-12 w-full max-w-[240px] rounded-full bg-transparent text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <a
              href="https://echo-vision-71.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Explore Echo Vision
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>

        {/* 4. Trust Indicators */}
        <p className="mt-10 text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase opacity-50">
          Accessibility-first • Privacy-focused • AI-powered
        </p>
      </div>

      {/* 6. Footer Micro Branding */}
      <div className="fixed bottom-12 flex w-full items-center justify-center px-6">
        <p className="text-center text-[9px] font-medium tracking-[0.2em] text-slate-500/40 uppercase">
          © 2026 Echo Vision. All rights reserved.
        </p>
      </div>
    </div>
  );
});

WelcomeView.displayName = 'WelcomeView';
