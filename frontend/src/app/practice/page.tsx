'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Flame, Brain, Calendar, Target, Trophy, RefreshCw, Play } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import {
  useReviewStats,
  useStartReviewSession,
  useRecordReview,
  useDueCards,
} from '@/hooks/use-graphql';
import { PracticeRunner } from '@/components/practice/PracticeRunner';
import type { CardState, DueCard, ReviewRating, ReviewResult } from '@/types/domain';

const DAILY_LIMIT = 20;

export default function PracticePage() {
  const auth = useAuth();
  const { loading, session: authSession } = auth;
  const { data: statsData, refetch } = useReviewStats(!authSession);
  const stats = statsData?.reviewStats;

  const [practiceSession, setPracticeSession] = useState<{ id: string; cards: DueCard[] } | null>(null);
  const [sessionSummary, setSessionSummary] = useState<{ total: number; correct: number; again: number } | null>(null);

  const [startSession] = useStartReviewSession();
  const [recordReview] = useRecordReview();
  const { data: dueData } = useDueCards({ limit: DAILY_LIMIT, mode: 'DAILY', skip: !!practiceSession });

  const dueCards = useMemo<DueCard[]>(
    () => (dueData?.dueCards ?? []).map((c) => ({
      wordId: c.wordId,
      character: c.character,
      pinyin: c.pinyin,
      english: c.english,
      category: c.category,
      travelSentence: c.travelSentence ?? null,
      masteryLevel: c.masteryLevel,
      state: c.state as CardState,
    })),
    [dueData],
  );

  async function beginSession(mode: 'DAILY' | 'SAVED_ONLY') {
    const { data } = await startSession({ mode, limit: DAILY_LIMIT });
    if (data?.startReviewSession) {
      setPracticeSession({
        id: data.startReviewSession.id,
        cards: (data.startReviewSession.cards as unknown as DueCard[]) ?? [],
      });
      setSessionSummary(null);
    }
  }

  useEffect(() => {
    if (practiceSession) refetch();
  }, [refetch, practiceSession]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Active session — show the practice runner.
  if (practiceSession) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Daily Review</h1>
          <Badge variant="outline">{practiceSession.cards.length} cards</Badge>
        </div>
        {practiceSession.cards.length === 0 ? (
          <Card className="p-8 text-center space-y-3">
            <Brain className="w-10 h-10 mx-auto text-emerald-500" />
            <p className="text-lg font-semibold">All caught up!</p>
            <p className="text-muted-foreground">No cards are due right now. Come back tomorrow or study new words from a province.</p>
            <Button variant="outline" onClick={() => setPracticeSession(null)}>
              Back to practice hub
            </Button>
          </Card>
        ) : (
          <PracticeRunner
            cards={practiceSession.cards}
            siblings={practiceSession.cards}
            sessionId={practiceSession.id}
            onRecordReview={async (vars) => {
              const { data } = await recordReview(vars);
              return { data: data as { recordReview: ReviewResult } | undefined };
            }}
            mode="DAILY"
            onComplete={(summary) => {
              setSessionSummary(summary);
              setPracticeSession(null);
            }}
          />
        )}
      </div>
    );
  }

  // Completion summary.
  if (sessionSummary) {
    const pct = sessionSummary.total ? Math.round((sessionSummary.correct / sessionSummary.total) * 100) : 0;
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-4">
        <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/20 dark:to-amber-950/20 border-2 border-emerald-200 dark:border-emerald-900/30">
          <Trophy className="w-14 h-14 mx-auto text-amber-500" />
          <h1 className="text-3xl font-bold">Session complete!</h1>
          <p className="text-muted-foreground">You reviewed {sessionSummary.total} cards.</p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <Stat label="Correct" value={`${sessionSummary.correct}`} />
            <Stat label="Retained" value={`${pct}%`} />
            <Stat label="To retry" value={`${sessionSummary.again}`} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button variant="outline" onClick={() => beginSession('DAILY')}>
              <RefreshCw className="w-4 h-4 mr-1" /> Review again
            </Button>
            <Link href="/dashboard"><Button>Back to dashboard</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  // Hub.
  const cardsDue = stats?.cardsDue ?? dueCards.length ?? 0;
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-1">Daily Practice</h1>
        <p className="text-muted-foreground">Spaced repetition keeps what you learn active for the long haul.</p>
      </div>

      {/* Streak + stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Flame className="w-5 h-5 text-amber-500" />} value={`${stats?.streak ?? 0}`} label="Day streak" />
        <StatCard icon={<Calendar className="w-5 h-5 text-blue-500" />} value={`${stats?.reviewedToday ?? 0}`} label="Reviewed today" />
        <StatCard icon={<Target className="w-5 h-5 text-emerald-500" />} value={`${stats?.retentionPct ?? 0}%`} label="Retention" />
      </div>

      {/* Start-session hero */}
      <Card className="p-6 text-center space-y-3 border-2 border-primary/20 bg-primary/5">
        <Brain className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-xl font-bold">{cardsDue} cards ready to review</h2>
        <p className="text-sm text-muted-foreground">Adaptive practice mixes listening, tone recall, fill-blank, writing, and matching based on each word&apos;s mastery.</p>
        <Button size="lg" className="rounded-2xl" disabled={cardsDue === 0} onClick={() => beginSession('DAILY')}>
          <Play className="w-4 h-4 mr-1" /> Start daily review
        </Button>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        <Card className="p-5 space-y-2 border">
          <h3 className="font-semibold">Saved-deck review</h3>
          <p className="text-sm text-muted-foreground">Review only the words you&apos;ve bookmarked.</p>
          <Button variant="outline" onClick={() => beginSession('SAVED_ONLY')} disabled={cardsDue === 0}>
            Review saved
          </Button>
        </Card>
        <Card className="p-5 space-y-2 border">
          <h3 className="font-semibold">Preview today&apos;s words</h3>
          <div className="flex flex-wrap gap-1.5">
            {dueCards.slice(0, 8).map((c) => (
              <span key={c.wordId} className="text-lg font-bold cn-display px-2 py-1 rounded bg-muted/40">{c.character}</span>
            ))}
          </div>
        </Card>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Daily cap: {DAILY_LIMIT} cards · new words mixed in as you study provinces
      </p>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <Card className="p-3 flex flex-col items-center text-center">
      {icon}
      <p className="text-2xl font-bold mt-0.5">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/60 dark:bg-zinc-800/60 rounded-xl p-3">
      <p className="text-2xl font-bold text-emerald-600">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}