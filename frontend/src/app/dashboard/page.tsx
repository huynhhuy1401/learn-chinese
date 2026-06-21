'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Trophy, Target, ArrowRight, CheckCircle2, Bookmark, Library, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const ME = gql`query Me { me { id name email } }`;
const PROGRESS = gql`query UserProgress { userProgress { provinceId completed score exercisesDone } }`;
const PROVINCES = gql`query Provinces { provinces { id name unlockOrder color capital imageUrl } }`;
const WORD_PROGRESS = gql`query WordProgress { wordProgress { masteryLevel word { character english } } }`;
const SAVED_COUNT = gql`query SavedWords { savedWords { id } }`;
const COURSES = gql`query Courses { courses { id name description level } }`;

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/login');
      else setLoading(false);
    });
  }, [router]);

  const { data: meData } = useQuery(ME, { skip: loading });
  const { data: progressData } = useQuery(PROGRESS, { skip: loading });
  const { data: provincesData } = useQuery(PROVINCES, { skip: loading });
  const { data: wordProgressData } = useQuery(WORD_PROGRESS, { skip: loading });
  const { data: savedData } = useQuery(SAVED_COUNT, { skip: loading });
  const { data: coursesData } = useQuery(COURSES);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const progress = progressData?.userProgress ?? [];
  const provinces = provincesData?.provinces ?? [];
  const completedIds = new Set(progress.filter((p: any) => p.completed).map((p: any) => p.provinceId));
  const totalScore = progress.reduce((s: number, p: any) => s + p.score, 0);
  const totalDone = progress.reduce((s: number, p: any) => s + p.exercisesDone, 0);
  const completedCount = completedIds.size;
  const progressPercent = provinces.length > 0 ? Math.round((completedCount / provinces.length) * 100) : 0;
  const sorted = [...provinces].sort((a: any, b: any) => a.unlockOrder - b.unlockOrder);
  const nextLesson = sorted.find((p: any) => !completedIds.has(p.id));
  const wordProgressList = wordProgressData?.wordProgress ?? [];
  const wordsToReview = wordProgressList.filter((wp: any) => wp.masteryLevel <= 2);
  const wordsMastered = wordProgressList.filter((wp: any) => wp.masteryLevel >= 4);
  const savedCount = savedData?.savedWords?.length ?? 0;

  const allCourses = coursesData?.courses ?? [];
  const activeCourses = allCourses.filter((c: any) => {
    if (c.level === 'hsk1') {
      return provinces.some((p: any) => completedIds.has(p.id) || progress.some((pr: any) => pr.provinceId === p.id));
    }
    return false;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">你好, {meData?.me?.name ?? 'Learner'}!</h1>
        <p className="text-muted-foreground">Track your Chinese learning journey.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Card className="p-4 text-center rounded-2xl border-2 border-red-100 dark:border-red-900/30">
          <p className="text-3xl font-bold text-red-600">{completedCount}/{provinces.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Lessons Done</p>
          <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </Card>
        <Card className="p-4 text-center rounded-2xl border-2 border-green-100 dark:border-green-900/30">
          <p className="text-3xl font-bold text-green-600">{wordsMastered.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Words Mastered</p>
          {wordsToReview.length > 0 && <p className="text-xs text-amber-500 mt-1">{wordsToReview.length} to review</p>}
        </Card>
        <Card className="p-4 text-center rounded-2xl border-2 border-amber-100 dark:border-amber-900/30">
          <p className="text-3xl font-bold text-amber-600">{savedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            <Bookmark className="w-3 h-3 inline mr-1" />Saved Words
          </p>
        </Card>
        <Card className="p-4 text-center rounded-2xl border-2 border-blue-100 dark:border-blue-900/30">
          <p className="text-3xl font-bold text-blue-600">
            {totalDone > 0 ? Math.round((totalScore / totalDone) * 100) : 0}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Accuracy</p>
        </Card>
      </div>

      {/* Quick Actions + Next Lesson */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        {/* Next lesson */}
        {nextLesson && (
          <Card className="lg:col-span-2 overflow-hidden rounded-2xl border-2 border-red-200 dark:border-red-900/30">
            <div className="flex flex-col sm:flex-row">
              {nextLesson.imageUrl && (
                <div className="sm:w-44 h-36 sm:h-auto shrink-0 overflow-hidden">
                  <img src={nextLesson.imageUrl} alt={nextLesson.name} className="w-full h-full object-cover" />
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

      {/* Course Progress — only courses you've started */}
      {activeCourses.length > 0 && <h2 className="text-lg font-bold mb-4">Your Courses</h2>}
      <div className="space-y-3 mb-8">
        {activeCourses.map((course: any) => {
          const courseLessons = provinces.filter((p: any) => {
            // All current provinces belong to HSK 1
            return course.level === 'hsk1';
          });
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
                    <Badge variant="secondary" className="text-[10px]">{course.level.toUpperCase()}</Badge>
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
          <p className="text-muted-foreground text-sm mb-4">You haven't started any courses yet. Begin with HSK 1!</p>
          <Link href="/courses">
            <Button className="rounded-xl">Browse Courses</Button>
          </Link>
        </Card>
      )}

      {/* Words to Review */}
      {wordsToReview.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">🔄 Words to Review</h2>
          <div className="flex flex-wrap gap-2">
            {wordsToReview.slice(0, 12).map((wp: any) => (
              <Link key={wp.word?.character} href="/flashcards">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-full border text-sm font-bold cn-display hover:border-red-300 transition-colors cursor-pointer">
                  {wp.word?.character}
                  <span className="text-[10px] text-muted-foreground ml-1">Lv.{wp.masteryLevel}</span>
                </span>
              </Link>
            ))}
            {wordsToReview.length > 12 && (
              <span className="text-sm text-muted-foreground self-center">+{wordsToReview.length - 12} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
