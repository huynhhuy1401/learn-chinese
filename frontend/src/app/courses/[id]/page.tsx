'use client';

import { useParams } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ChevronLeft, CheckCircle2, Lock } from 'lucide-react';

const COURSE_QUERY = gql`
  query Course($id: ID!) {
    course(id: $id) {
      id name description level
      provinces { id name capital unlockOrder color imageUrl }
    }
  }
`;

const PROGRESS_QUERY = gql`
  query UserProgress {
    userProgress { provinceId completed score exercisesDone }
  }
`;

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
  }, []);

  const { data, loading } = useQuery(COURSE_QUERY, { variables: { id } });
  const { data: progressData } = useQuery(PROGRESS_QUERY, { skip: !userId });

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const course = data?.course;
  if (!course) return <div className="max-w-xl mx-auto px-4 py-20 text-center text-muted-foreground">Course not found.</div>;

  const progress = progressData?.userProgress ?? [];
  const completedIds = new Set(progress.filter((p: any) => p.completed).map((p: any) => p.provinceId));
  const progressMap = new Map(progress.map((p: any) => [p.provinceId, p]));
  const provinces = course.provinces ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> All Courses
      </Link>

      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">{course.level.toUpperCase()}</Badge>
        <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
        <p className="text-muted-foreground">{course.description}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {provinces.map((p: any, i: number) => {
          const isCompleted = completedIds.has(p.id);
          const isLocked = !isCompleted && i > 0 && !completedIds.has(provinces[i - 1]?.id);

          const prog: any = progressMap.get(p.id);

          return (
            <Link key={p.id} href={isLocked ? '#' : `/lessons/${p.id}`} className={isLocked ? 'pointer-events-none' : ''}>
              <Card className={`overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                isLocked ? 'opacity-40 border-gray-200 dark:border-gray-700'
                : isCompleted ? 'border-green-200 dark:border-green-800 hover:shadow-lg hover:-translate-y-1'
                : 'border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 hover:border-red-200 dark:hover:border-red-800'
              }`}>
                <div className="relative h-40 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
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
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ backgroundColor: p.color }}>
                        {p.unlockOrder}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-0.5">Lesson {p.unlockOrder}</p>
                    <h3 className="text-lg font-bold text-white leading-tight">{p.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{p.capital}</Badge>
                    {isCompleted && <Badge className="text-xs bg-green-500 text-white">Done</Badge>}
                  </div>
                  {(prog?.exercisesDone ?? 0) > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${((prog?.score ?? 0) / (prog?.exercisesDone ?? 1)) * 100}%` }} />
                      </div>
                      <span className="text-xs text-green-600 font-medium whitespace-nowrap">{prog?.score ?? 0}/{prog?.exercisesDone ?? 0}</span>
                    </div>
                  ) : null}
                  {isLocked && <p className="text-xs text-muted-foreground">🔒 Complete previous lesson</p>}
                  {!prog && !isCompleted && !isLocked && <p className="text-xs text-muted-foreground">Not started</p>}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
