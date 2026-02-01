'use client';

import React, { forwardRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Mic, Navigation, ShieldCheck, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/shadcn/utils';

function WelcomeImage() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary mb-6 size-16"
    >
      <path
        d="M15 24V40C15 40.7957 14.6839 41.5587 14.1213 42.1213C13.5587 42.6839 12.7956 43 12 43C11.2044 43 10.4413 42.6839 9.87868 42.1213C9.31607 41.5587 9 40.7957 9 40V24C9 23.2044 9.31607 22.4413 9.87868 21.8787C10.4413 21.3161 11.2044 21 12 21C12.7956 21 13.5587 21.3161 14.1213 21.8787C14.6839 22.4413 15 23.2044 15 24ZM22 5C21.2044 5 20.4413 5.31607 19.8787 5.87868C19.3161 6.44129 19 7.20435 19 8V56C19 56.7957 19.3161 57.5587 19.8787 58.1213C20.4413 58.6839 21.2044 59 22 59C22.7956 59 23.5587 58.6839 24.1213 58.1213C24.6839 57.5587 25 56.7957 25 56V8C25 7.20435 24.6839 6.44129 24.1213 5.87868C23.5587 5.31607 22.7956 5 22 5ZM32 13C31.2044 13 30.4413 13.3161 29.8787 13.8787C29.3161 14.4413 29 15.2044 29 16V48C29 48.7957 29.3161 49.5587 29.8787 50.1213C30.4413 50.6839 31.2044 51 32 51C32.7956 51 33.5587 50.6839 34.1213 50.1213C34.6839 49.5587 35 48.7957 35 48V16C35 15.2044 34.6839 14.4413 34.1213 13.8787C33.5587 13.3161 32.7956 13 32 13ZM42 21C41.2043 21 40.4413 21.3161 39.8787 21.8787C39.3161 22.4413 39 23.2044 39 24V40C39 40.7957 39.3161 41.5587 39.8787 42.1213C40.4413 42.6839 41.2043 43 42 43C42.7957 43 43.5587 42.6839 44.1213 42.1213C44.6839 41.5587 45 40.7957 45 40V24C45 23.2044 44.6839 22.4413 44.1213 21.8787C43.5587 21.3161 42.7957 21 42 21ZM52 17C51.2043 17 50.4413 17.3161 49.8787 17.8787C49.3161 18.4413 49 19.2044 49 20V44C49 44.7957 49.3161 45.5587 49.8787 46.1213C50.4413 46.6839 51.2043 47 52 47C52.7957 47 53.5587 46.6839 54.1213 46.1213C54.6839 45.5587 55 44.7957 55 44V20C55 19.2044 54.6839 18.4413 54.1213 17.8787C53.5587 17.3161 52.7957 17 52 17Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = forwardRef<HTMLDivElement, WelcomeViewProps & React.ComponentProps<'div'>>(
  ({ startButtonText, onStartCall, className, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = () => {
      setIsLoading(true);
      onStartCall();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-background flex h-svh w-full flex-col items-center justify-center overflow-hidden px-6 text-foreground",
          className
        )}
        {...props}
      >
        <div className="flex w-full max-w-2xl flex-col items-center justify-center text-center">
          {/* 1. Brand Section */}
          <div className="relative mb-8 flex flex-col items-center justify-center">
            <div className="bg-primary/5 absolute h-40 w-40 animate-pulse rounded-full blur-[80px]" />
            <WelcomeImage />
            <h1 className="text-white mb-2 text-4xl font-semibold tracking-tight md:text-5xl">
              Echo Vision
            </h1>
            <p className="text-slate-400 max-w-md text-lg font-medium leading-relaxed">
              Empowering Vision Beyond Sight
            </p>
          </div>

          {/* 5. Minimal Feature Hints */}
          <div className="mb-12 flex flex-wrap justify-center gap-x-8 gap-y-4 opacity-40">
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
          <div className="flex w-full flex-col items-center gap-4">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={isLoading}
              className="bg-primary h-14 w-full max-w-[280px] rounded-full text-base font-semibold tracking-wide text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              {isLoading ? 'Initializing...' : startButtonText}
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-primary text-primary h-12 w-full max-w-[240px] rounded-full bg-transparent text-sm font-medium transition-all duration-200 hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <a href="https://echo-vision-71.web.app" target="_blank" rel="noopener noreferrer">
                Explore Echo Vision
                <ExternalLink className="ml-2 size-3" />
              </a>
            </Button>
          </div>

          {/* 4. Trust Indicators */}
          <p className="text-slate-500 mt-8 text-[10px] font-medium tracking-[0.15em] uppercase opacity-60">
            Accessibility-first • Privacy-focused • AI-powered
          </p>
        </div>

        {/* 6. Footer Micro Branding */}
        <div className="fixed bottom-12 flex w-full items-center justify-center px-6">
          <p className="text-slate-500/40 text-center text-[9px] font-medium tracking-[0.2em] uppercase">
            © Echo Vision • Accessibility First
          </p>
        </div>
      </div>
    );
  }
);

WelcomeView.displayName = 'WelcomeView';
