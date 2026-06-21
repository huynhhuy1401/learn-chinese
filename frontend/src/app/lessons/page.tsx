'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight, Lock, CheckCircle2, BookOpen, MapPin, ChefHat } from 'lucide-react';

const PROVINCES_QUERY = gql`
  query Provinces {
    provinces { id name capital unlockOrder color imageUrl culturalDescription food landmark vocabulary { id } grammar { id } }
  }
`;

const PROGRESS_QUERY = gql`
  query UserProgress { userProgress { provinceId completed score exercisesDone } }
`;

export default function LessonsPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
  }, []);

  const { data, loading } = useQuery(PROVINCES_QUERY);
  const { data: progressData } = useQuery(PROGRESS_QUERY, { skip: !userId });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const provinces = data?.provinces ?? [];
  const progress = progressData?.userProgress ?? [];
  const completedIds = new Set(progress.filter((p: any) => p.completed).map((p: any) => p.provinceId));
  const progressMap = new Map(progress.map((p: any) => [p.provinceId, p]));

  const completedCount = completedIds.size;
  const totalScore = progress.reduce((s: number, p: any) => s + p.score, 0);
  const totalDone = progress.reduce((s: number, p: any) => s + p.exercisesDone, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Course Lessons</h1>
        <p className="text-muted-foreground">
          Nine lessons across China — each one builds on the last.
        </p>
      </div>

      {/* Progress summary */}
      {userId && (
        <div className="grid grid-cols-3 gap-3 mb-10">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{completedCount}/9</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{totalScore}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{totalDone}</p>
            <p className="text-xs text-muted-foreground">Exercises</p>
          </Card>
        </div>
      )}

      {/* Lesson cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...provinces]
          .sort((a: any, b: any) => a.unlockOrder - b.unlockOrder)
          .map((province: any, i: number) => {
            const isCompleted = completedIds.has(province.id);
            const isLocked =
              i > 0 &&
              !isCompleted &&
              !completedIds.has(
                provinces.find((p: any) => p.unlockOrder === province.unlockOrder - 1)?.id ?? '',
              );
            const p = progressMap.get(province.id);

            return (
              <Link
                key={province.id}
                href={isLocked ? '#' : `/lessons/${province.id}`}
                className={isLocked ? 'pointer-events-none' : ''}
              >
                <Card
                  className={`overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                    isLocked
                      ? 'opacity-40 border-gray-200 dark:border-gray-700'
                      : isCompleted
                        ? 'border-green-200 dark:border-green-800 hover:shadow-lg hover:-translate-y-1'
                        : 'border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 hover:border-red-200 dark:hover:border-red-800'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    {province.imageUrl ? (
                      <img src={province.imageUrl} alt={province.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-950/30 dark:to-amber-950/30" />
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Status badge - top right */}
                    <div className="absolute top-3 right-3">
                      {isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      ) : isLocked ? (
                        <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg backdrop-blur-sm"
                          style={{ backgroundColor: province.color }}
                        >
                          {province.unlockOrder}
                        </div>
                      )}
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-0.5">
                        Lesson {province.unlockOrder}
                      </p>
                      <h3 className="text-lg font-bold text-white leading-tight">{province.name}</h3>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{province.capital}</Badge>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {province.vocabulary?.length ?? 0} words
                      </span>
                    </div>
                    {p && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${p.exercisesDone > 0 ? (p.score / p.exercisesDone) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-green-600 font-medium whitespace-nowrap">
                          {p.score}/{p.exercisesDone}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
      </div>

      {!userId && (
        <div className="text-center mt-8 p-8 bg-muted/50 rounded-2xl">
          <p className="text-muted-foreground mb-3">Create an account to track your progress.</p>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
