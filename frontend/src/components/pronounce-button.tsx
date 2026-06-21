'use client';

import { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface PronounceButtonProps {
  text: string; // Chinese characters or pinyin
  lang?: 'zh-CN' | 'en-US';
  rate?: number; // 0.1 - 10, lower = slower
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'outline';
}

export function PronounceButton({
  text,
  lang = 'zh-CN',
  rate = 0.75,
  size = 'sm',
  variant = 'ghost',
}: PronounceButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      setError(true);
      return;
    }

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.volume = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      setError(true);
    };

    window.speechSynthesis.speak(utterance);
  };

  if (error) return null;

  return (
    <Button
      variant={variant}
      size={size === 'sm' ? 'icon' : 'default'}
      className={cn(
        'shrink-0',
        speaking && 'text-red-600',
        size === 'sm' && 'h-7 w-7',
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        speak();
      }}
      title={`Pronounce: ${text}`}
      aria-label={`Pronounce: ${text}`}
    >
      {speaking ? (
        <Loader2 className={cn('animate-spin', size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
      ) : (
        <Volume2 className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      )}
    </Button>
  );
}
