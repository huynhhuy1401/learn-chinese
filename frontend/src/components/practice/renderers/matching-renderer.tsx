'use client';

import { useState, useEffect } from 'react';
import type { RenderProps } from '../renderer.types';

interface MatchingItem {
  left: string;
  right: string;
}

/**
 * MATCHING — match the left column (characters) to the right column (meanings).
 * The item's `options` JSON carries the pairs as an array of {left,right}.
 * The submitted answer is a { left: right } map passed to the strategy.
 */
export function MatchingRenderer({ item, onResolve, disabled }: RenderProps) {
  const [pairs, setPairs] = useState<MatchingItem[]>([]);
  const [rights, setRights] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = JSON.parse((item.options as unknown as string) ?? '[]') as MatchingItem[];
      setPairs(raw);
      setRights(raw.map((p) => p.right).sort(() => Math.random() - 0.5));
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatches({});
    } catch {
      setPairs([]);
      setRights([]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatches({});
    }
  }, [item.options]);

  const handleMatch = (left: string, right: string) => {
    const nextMatches = { ...matches, [left]: right };
    setMatches(nextMatches);
    setSelectedLeft(null);
    setSelectedRight(null);

    // If all pairs are matched, submit
    if (Object.keys(nextMatches).length === pairs.length) {
      onResolve({ answer: nextMatches });
    }
  };

  const handleLeftClick = (left: string) => {
    if (disabled) return;

    // If left is already matched, unmatch it first
    if (matches[left]) {
      const nextMatches = { ...matches };
      delete nextMatches[left];
      setMatches(nextMatches);
      // Select the unmatched left
      setSelectedLeft(left);
      setSelectedRight(null);
      return;
    }

    // If a right item is already selected, pair them
    if (selectedRight) {
      handleMatch(left, selectedRight);
    } else {
      // Toggle selection
      if (selectedLeft === left) {
        setSelectedLeft(null);
      } else {
        setSelectedLeft(left);
        setSelectedRight(null);
      }
    }
  };

  const handleRightClick = (right: string) => {
    if (disabled) return;

    // Find if this right is already matched
    const matchedLeft = Object.keys(matches).find((key) => matches[key] === right);
    if (matchedLeft) {
      const nextMatches = { ...matches };
      delete nextMatches[matchedLeft];
      setMatches(nextMatches);
      // Select the unmatched right
      setSelectedRight(right);
      setSelectedLeft(null);
      return;
    }

    // If a left item is already selected, pair them
    if (selectedLeft) {
      handleMatch(selectedLeft, right);
    } else {
      // Toggle selection
      if (selectedRight === right) {
        setSelectedRight(null);
      } else {
        setSelectedRight(right);
        setSelectedLeft(null);
      }
    }
  };

  if (pairs.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">No matching data.</p>;
  }

  // Get index numbers for matched pairs to show pairing badges
  const sortedLefts = Object.keys(matches).sort();
  const getMatchNumber = (left: string) => {
    const idx = sortedLefts.indexOf(left);
    return idx >= 0 ? idx + 1 : null;
  };

  const getMatchNumberForRight = (right: string) => {
    const key = Object.keys(matches).find((k) => matches[k] === right);
    return key ? getMatchNumber(key) : null;
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <p className="text-sm text-muted-foreground text-center">
        Select a Chinese character and its English meaning to match them
      </p>
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column (Chinese characters) */}
        <div className="space-y-2">
          {pairs.map((p) => {
            const isMatched = !!matches[p.left];
            const isSelected = selectedLeft === p.left;
            const num = getMatchNumber(p.left);

            return (
              <button
                key={p.left}
                disabled={disabled}
                onClick={() => handleLeftClick(p.left)}
                className={`w-full py-3 px-4 rounded-xl border-2 text-lg font-bold cn-display transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary scale-[1.02] shadow-sm'
                    : isMatched
                    ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                    : 'border-border bg-white dark:bg-zinc-900 hover:border-primary/40'
                }`}
              >
                <span>{p.left}</span>
                {num && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-medium">
                    {num}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column (English meanings) */}
        <div className="space-y-2">
          {rights.map((r) => {
            const matchedLeft = Object.keys(matches).find((key) => matches[key] === r);
            const isMatched = !!matchedLeft;
            const isSelected = selectedRight === r;
            const num = getMatchNumberForRight(r);

            return (
              <button
                key={r}
                disabled={disabled}
                onClick={() => handleRightClick(r)}
                className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary scale-[1.02] shadow-sm'
                    : isMatched
                    ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                    : 'border-border bg-white dark:bg-zinc-900 hover:border-primary/40'
                }`}
              >
                <span className="text-left leading-snug pr-2">{r}</span>
                {num && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-medium shrink-0">
                    {num}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}