'use client';

import { useEffect, useState, useRef } from 'react';

interface StepTransitionProps {
  step: number;
  children: React.ReactNode;
}

export function StepTransition({ step, children }: StepTransitionProps) {
  const [visible, setVisible] = useState(true);
  const [currentChildren, setCurrentChildren] = useState(children);
  const prevStep = useRef(step);

  useEffect(() => {
    if (step !== prevStep.current) {
      // Fade out
      setVisible(false);
      const timeout = setTimeout(() => {
        setCurrentChildren(children);
        setVisible(true);
        prevStep.current = step;
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setCurrentChildren(children);
    }
  }, [step, children]);

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      {currentChildren}
    </div>
  );
}
