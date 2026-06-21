'use client';

import { useState, useCallback, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PronounceButton } from '@/components/pronounce-button';
import { Loader2, Bookmark, CheckCircle2, RotateCcw, Eye, ArrowRight, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const SAVED_WORDS = gql`
  query SavedWords {
    savedWords { id word { id character pinyin english category travelSentence } }
  }
`;

const REVIEW_WORD = gql`
  mutation ReviewWord($wordId: ID!, $correct: Boolean!) {
    reviewWord(wordId: $wordId, correct: $correct) { id masteryLevel }
  }
`;

export default function FlashcardsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/login');
      else setReady(true);
    });
  }, [router]);

  const { data, loading: queryLoading } = useQuery(SAVED_WORDS, {
    skip: !ready,
    fetchPolicy: 'cache-and-network',
  });
  const [reviewWord] = useMutation(REVIEW_WORD);

  const words = (data?.savedWords ?? []).map((s: any) => s.word);
  const [shuffled, setShuffled] = useState<any[]>([]);

  useEffect(() => {
    if (words.length > 0) {
      setShuffled([...words].sort(() => Math.random() - 0.5));
      setCurrentIdx(0);
    }
  }, [data]);

  const word = shuffled[currentIdx];
  const isLast = currentIdx === shuffled.length - 1;
  const allDone = shuffled.length > 0 && results.length === shuffled.length;
  const correctCount = results.filter((r) => r.correct).length;

  const handleReveal = useCallback(() => setRevealed(true), []);

  const handleResult = useCallback((correct: boolean) => {
    setResults((prev) => [...prev, { id: word?.id, correct }]);
    if (word) reviewWord({ variables: { wordId: word.id, correct } }).catch(() => {});
    if (isLast) {
      setRevealed(false);
    } else {
      setCurrentIdx((c) => c + 1);
      setRevealed(false);
    }
  }, [isLast, word, reviewWord]);

  if (queryLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (shuffled.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Bookmark className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-40" />
        <h1 className="text-2xl font-bold mb-2">No Flashcards Yet</h1>
        <p className="text-muted-foreground mb-6">
          Save words as you learn and review them here. Look for the 🔖 icon on word cards!
        </p>
        <Link href="/vocabulary">
          <Button size="lg" className="rounded-2xl">Browse Vocabulary</Button>
        </Link>
      </div>
    );
  }

  if (allDone) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <Card className="p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700">
          <p className="text-5xl mb-4">{correctCount === shuffled.length ? '🎉' : '📊'}</p>
          <h1 className="text-2xl font-bold mb-2">Review Complete!</h1>
          <p className="text-muted-foreground mb-6">
            {correctCount}/{shuffled.length} correct
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => {
              setCurrentIdx(0); setResults([]); setRevealed(false);
            }} className="rounded-2xl">
              <Shuffle className="w-4 h-4 mr-2" /> Review Again
            </Button>
            <Link href="/vocabulary">
              <Button className="rounded-2xl">Find More Words <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">🔖 Flashcards</h1>
        <span className="text-sm text-muted-foreground">
          {currentIdx + 1}/{shuffled.length} · {correctCount} correct
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1.5 justify-center mb-6">
        {shuffled.slice(0, Math.min(shuffled.length, 20)).map((_, i) => {
          const res = results[i];
          return (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < currentIdx
                  ? res?.correct ? 'w-6 bg-green-400' : 'w-6 bg-amber-400'
                  : i === currentIdx ? 'w-8 bg-red-500' : 'w-4 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          );
        })}
      </div>

      {/* Card */}
      <div className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-8 sm:p-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-7xl sm:text-8xl font-bold cn-display select-none leading-none">
            {word.character}
          </span>
          <PronounceButton text={word.character} size="md" />
        </div>

        <p className="text-sm text-muted-foreground mb-6">What does this mean?</p>

        {!revealed ? (
          <Button size="lg" onClick={handleReveal} className="rounded-2xl px-10 h-14 text-lg bg-red-600 hover:bg-red-700">
            <Eye className="w-5 h-5 mr-2" /> Show Answer
          </Button>
        ) : (
          <div>
            <div className="rounded-2xl bg-[#e8f0fe] dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-5 mb-6">
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-1">{word.pinyin}</p>
              <p className="text-3xl font-bold">{word.english}</p>
            </div>
            {word.travelSentence && (
              <div className="rounded-xl bg-muted/30 p-4 mb-6 text-left">
                <p className="text-lg font-medium cn-display">{word.travelSentence}</p>
              </div>
            )}
            <div className="flex justify-center gap-3">
              <Button size="lg" variant="outline" className="rounded-2xl h-14 px-6 border-2 border-amber-300" onClick={() => handleResult(false)}>
                <RotateCcw className="w-5 h-5 mr-2 text-amber-500" /> Again
              </Button>
              <Button size="lg" className="rounded-2xl h-14 px-8 bg-green-600 hover:bg-green-700" onClick={() => handleResult(true)}>
                <CheckCircle2 className="w-5 h-5 mr-2" /> Got It
              </Button>
            </div>
          </div>
        )}
      </div>

      {!revealed && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 rounded text-[11px] font-mono border">Space</kbd> to reveal
        </p>
      )}
    </div>
  );
}
