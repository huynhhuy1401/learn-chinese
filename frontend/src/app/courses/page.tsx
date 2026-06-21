'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, GraduationCap, BookOpen, ChevronRight, Lock } from 'lucide-react';

const COURSES = gql`
  query Courses {
    courses { id name description level lessonCount }
  }
`;

export default function CoursesPage() {
  const { data, loading } = useQuery(COURSES);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const courses = data?.courses ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <GraduationCap className="w-12 h-12 mx-auto text-red-600 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Chinese Courses</h1>
        <p className="text-muted-foreground">HSK-aligned courses with interactive stories, flashcards, and cultural exploration.</p>
      </div>

      <div className="grid gap-6">
        {courses.map((course: any) => {
          const isAvailable = course.lessonCount > 0;
          return (
            <Link key={course.id} href={isAvailable ? `/courses/${course.id}` : '#'} className={!isAvailable ? 'pointer-events-none' : ''}>
              <Card className={`p-6 sm:p-8 transition-all hover:shadow-lg ${
                isAvailable
                  ? 'cursor-pointer hover:border-red-200 dark:hover:border-red-800'
                  : 'opacity-50'
              }`}>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                    <BookOpen className="w-7 h-7 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{course.level.toUpperCase()}</Badge>
                      {!isAvailable && (
                        <Badge variant="outline" className="text-amber-500 border-amber-500">
                          <Lock className="w-3 h-3 mr-1" /> Coming Soon
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-xl font-bold mb-1">{course.name}</h2>
                    <p className="text-muted-foreground text-sm">{course.description}</p>
                    {isAvailable && (
                      <p className="text-sm text-red-600 font-medium mt-2">
                        {course.lessonCount} lessons available
                      </p>
                    )}
                  </div>
                  {isAvailable && <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
