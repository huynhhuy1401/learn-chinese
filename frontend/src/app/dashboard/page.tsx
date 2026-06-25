'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, ArrowRight, CheckCircle2, Bookmark, Library, GraduationCap, Brain, Flame } from 'lucide-react';
import Link from 'next/link';
import { useRequireAuth, useAuth } from '@/components/auth/auth-provider';
import {
  useCurrentUserQuery,
  useProvinces,
  useUserProgress,
  useReviewStats,
  useSavedWords,
  useCourses,
} from '@/hooks/use-graphql';

export default function DashboardPage() {
  const auth = useRequireAuth();
  const { authUser } = useAuth();

  const { data: meData } = useCurrentUserQuery();
  const { data: provincesData } = useProvinces();
  const { data: progressData } = useUserProgress();
  const { data: statsData } = useReviewStats();
  const { data: savedData } = useSavedWords();
  const { data: coursesData } = useCourses();

  if (auth.loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  const progress = progressData?.userProgress ?? [];
  const provinces = provincesData?.provinces ?? [];
  const completedIds = new Set(progress.filter((p: any) => p.completed).map((p: any) => p.provinceId));
  const totalScore = progress.reduce((s: number, p: any) => s + p.score, 0);
  const totalDone = progress.reduce((s: number, p: any) => s + (p.exercisesDone ?? 0), 0);
  const completedCount = completedIds.size;
  const progressPercent = provinces.length > 0 ? Math.round((completedCount / provinces.length) * 100) : 0;
  const sorted = [...provinces].sort((a: any, b: any) => a.unlockOrder - b.unlockOrder);
  const nextLesson = sorted.find((p: any) => !completedIds.has(p.id));

  const stats = statsData?.reviewStats;
  const savedCount = savedData?.savedWords?.length ?? 0;

  const allCourses = coursesData?.courses ?? [];
  const activeCourses = allCourses.filter((c: any) => c.level === 'HSK1');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">你好, {meData?.currentUser?.name ?? authUser?.name ?? 'Learner'}!</h1>
          <p className="text-muted-foreground">Track your Chinese learning journey.</p>
        </div>
        {stats && stats.cardsDue > 0 && (
          <Link href="/practice">
            <Button size="lg" className="rounded-2xl btn-premium bg-primary text-primary-foreground">
              <Brain className="w-4 h-4 mr-1.5" /> {stats.cardsDue} to review
            </Button>
          </Link>
        )}
      </div>

      {/* SRS + streak summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Card className="p-4 text-center rounded-2xl border-2 border-red-100 dark:border-red-900/30">
          <p className="text-3xl font-bold text-red-600">{completedCount}/{provinces.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Lessons Done</p>
          <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </Card>
        <Card className="p-4 text-center rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30">
          <p className="text-3xl font-bold text-emerald-600 flex items-center justify-center gap-1">
            <Flame className="w-6 h-6 text-amber-500" /> {stats?.streak ?? 0}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Day streak</p>
          {(stats?.retentionPct ?? 0) > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{stats?.retentionPct}% retention</p>
          )}
        </Card>
        <Card className="p-4 text-center rounded-2xl border-2 border-amber-100 dark:border-amber-900/30">
          <p className="text-3xl font-bold text-amber-600">{savedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            <Bookmark className="w-3 h-3 inline mr-1" />Saved Words
          </p>
          {(stats?.cardsDue ?? 0) > 0 && <p className="text-xs text-amber-500 mt-1">{stats?.cardsDue} to review</p>}
        </Card>
        <Card className="p-4 text-center rounded-2xl border-2 border-blue-100 dark:border-blue-900/30">
          <p className="text-3xl font-bold text-blue-600">
            {totalDone > 0 ? Math.round((totalScore / totalDone) * 100) : 0}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Exercise accuracy</p>
        </Card>
      </div>

      {/* Quick Actions + Next Lesson */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        {/* Next lesson */}
        {nextLesson && (
          <Card className="lg:col-span-2 overflow-hidden rounded-2xl border-2 border-red-200 dark:border-red-900/30">
            <div className="flex flex-col sm:flex-row">
              {(nextLesson as any).imageUrl && (
                <div className="sm:w-44 h-36 sm:h-auto shrink-0 overflow-hidden">
                  <img src={(nextLesson as any).imageUrl} alt={nextLesson.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Continue Learning</p>
                  <h2 className="text-xl font-bold">{nextLesson.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{nextLesson.capital}</Badge>
                    <span className="text-xs text-muted-foreground">Lesson {nextLesson.unlockOrder}</span>
                  </div>
                </div>
                <Link href={`/lessons/${nextLesson.id}`} className="mt-3">
                  <Button size="sm" className="rounded-xl">Continue <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Quick links */}
        <Card className="p-5 rounded-2xl">
          <h3 className="font-semibold text-sm mb-3">Quick Access</h3>
          <div className="space-y-2">
            <Link href="/practice" className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors">
              <Brain className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium">Daily Practice {(stats?.cardsDue ?? 0) > 0 && `(${stats?.cardsDue})`}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
            </Link>
            <Link href="/courses" className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors">
              <GraduationCap className="w-5 h-5 text-red-600 shrink-0" />
              <span className="text-sm font-medium">HSK 1 Course</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
            </Link>
            <Link href="/flashcards" className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors">
              <Bookmark className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-sm font-medium">Flashcards {savedCount > 0 && `(${savedCount})`}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
            </Link>
            <Link href="/vocabulary" className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors">
              <Library className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="text-sm font-medium">Vocabulary</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Course Progress */}
      {activeCourses.length > 0 && <h2 className="text-lg font-bold mb-4">Your Courses</h2>}
      <div className="space-y-3 mb-8">
        {activeCourses.map((course: any) => {
          // All current provinces belong to HSK 1.
          const courseLessons = provinces;
          const courseCompleted = courseLessons.filter((p: any) => completedIds.has(p.id)).length;
          const courseTotal = courseLessons.length;
          const coursePct = courseTotal > 0 ? Math.round((courseCompleted / courseTotal) * 100) : 0;
          const isAvailable = courseTotal > 0;
          return (
            <Link key={course.id} href={isAvailable ? `/courses/${course.id}` : '/courses'} className={!isAvailable ? 'pointer-events-none' : ''}>
              <Card className={`p-5 flex items-center gap-5 transition-all rounded-2xl border-2 ${
                !isAvailable ? 'opacity-50' : 'hover:shadow-md hover:border-red-200 cursor-pointer'
              }`}>
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{course.name}</h3>
                    <Badge variant="secondary" className="text-[10px]">{course.level}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{course.description}</p>
                  {isAvailable ? (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{courseCompleted}/{courseTotal} lessons</span>
                        <span className="font-medium">{coursePct}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${coursePct}%` }} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-500 font-medium">Coming soon</p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Card>
            </Link>
          );
        })}
      </div>

      {activeCourses.length === 0 && (
        <Card className="p-8 text-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 mb-8">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-40" />
          <h3 className="font-bold text-lg mb-2">Start Your Journey</h3>
          <p className="text-muted-foreground text-sm mb-4">You haven&apos;t started any courses yet. Begin with HSK 1!</p>
          <Link href="/courses">
            <Button className="rounded-xl">Browse Courses</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}