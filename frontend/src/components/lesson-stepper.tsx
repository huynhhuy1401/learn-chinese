'use client';

import { CheckCircle2 } from 'lucide-react';

const stepLabels = ['Welcome', 'Vocabulary', 'Grammar', 'Practice', 'Culture', 'Done'];
const stepIcons = ['👋', '📖', '📐', '✏️', '🏛️', '🎉'];

interface LessonStepperProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

export function LessonStepper({ currentStep, completedSteps, onStepClick }: LessonStepperProps) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {stepLabels.map((label, i) => {
        const isCompleted = completedSteps.has(i);
        const isCurrent = currentStep === i;
        const maxReachable = Math.max(0, ...completedSteps) + 1;
        const isClickable = isCompleted || i <= maxReachable;

        return (
          <div key={i} className="flex items-center flex-1">
            <button
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default opacity-35'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-md shadow-green-200 dark:shadow-green-900/30'
                    : isCurrent
                      ? 'bg-red-600 text-white ring-[3px] ring-red-200 dark:ring-red-900/40 shadow-lg shadow-red-200 dark:shadow-red-900/30 scale-110'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepIcons[i]}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-semibold hidden sm:block transition-all duration-300 ${
                  isCurrent ? 'text-foreground scale-110' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </button>
            {/* Connector line */}
            {i < stepLabels.length - 1 && (
              <div className="flex-1 h-0.5 -mt-4 hidden sm:block mx-0.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 dark:bg-green-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: completedSteps.has(i) ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
