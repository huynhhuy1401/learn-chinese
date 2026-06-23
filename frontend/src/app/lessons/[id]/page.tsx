'use client';

import { useParams, useRouter } from 'next/navigation';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PronounceButton } from '@/components/pronounce-button';
import { SaveWordButton } from '@/components/save-word-button';
import { VocabBatch } from '@/components/lesson-vocab-batch';
import { LessonGrammarCard } from '@/components/lesson-grammar-card';
import { LessonPractice } from '@/components/lesson-practice';
import { StoryPlayer } from '@/components/story-player';
import {
  Loader2, ChevronRight, ChevronLeft, BookOpen, Languages, PenTool,
  Trophy, Sparkles, CheckCircle2, ArrowRight, Library, ScrollText,
  Building2, ChefHat, Compass,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const LESSON_QUERY = gql`
  query Province($id: ID!) {
    province(id: $id) {
      id name capital unlockOrder color imageUrl storyContent
      culturalDescription landmark landmarkFact food foodDescription custom
      vocabulary { id character pinyin english category travelSentence }
      grammar { id title explanation examples }
      exercises { id type question questionLabel options correctAnswer }
    }
    provinces { id name unlockOrder color capital }
  }
`;

const USER_PROGRESS_QUERY = gql`
  query UserProgress {
    userProgress { provinceId completed score exercisesDone }
    wordProgress { wordId masteryLevel }
  }
`;

const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer($exerciseId: String!, $answer: String!, $provinceId: ID!) {
    submitAnswer(exerciseId: $exerciseId, answer: $answer, provinceId: $provinceId) { correct correctAnswer }
  }
`;

const COMPLETE_PROVINCE = gql`
  mutation CompleteProvince($provinceId: ID!) {
    completeProvince(provinceId: $provinceId) { id completed }
  }
`;

const REVIEW_WORD = gql`
  mutation ReviewWord($wordId: ID!, $correct: Boolean!) {
    reviewWord(wordId: $wordId, correct: $correct) { id masteryLevel }
  }
`;

export default function LessonDetailPage() {
  // ====== ALL HOOKS AT TOP ======
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading } = useQuery(LESSON_QUERY, { variables: { id } });
  const { data: progressData } = useQuery(USER_PROGRESS_QUERY);
  const [submitAnswer] = useMutation(SUBMIT_ANSWER);
  const [completeProvince] = useMutation(COMPLETE_PROVINCE);
  const [reviewWord] = useMutation(REVIEW_WORD);

  // Load saved progress from backend
  const savedProgress = progressData?.userProgress?.find((p: any) => p.provinceId === id);
  const wordProgressList = progressData?.wordProgress ?? [];
  const studiedWordIds = new Set(wordProgressList.map((wp: any) => wp.wordId));

  const [view, setView] = useState<string>('story');
  const [vocabDone, setVocabDone] = useState(savedProgress?.exercisesDone > 0 || false);
  const [grammarDone, setGrammarDone] = useState(false);
  const [practiceDone, setPracticeDone] = useState(savedProgress?.completed || false);
  const [practiceScore, setPracticeScore] = useState(savedProgress?.score || 0);
  const [practiceTotal, setPracticeTotal] = useState(savedProgress?.exercisesDone || 0);

  // Derived data
  const lesson = data?.province ?? null;
  const allProvinces = data?.provinces ?? [];
  const vocabBatches = useMemo(() => {
    if (!lesson?.vocabulary) return [];
    const batchSize = 5;
    const batches = [];
    for (let i = 0; i < lesson.vocabulary.length; i += batchSize) batches.push(lesson.vocabulary.slice(i, i + batchSize));
    return batches;
  }, [lesson?.vocabulary]);

  const sortedProvinces = useMemo(() =>
    [...allProvinces].sort((a: any, b: any) => a.unlockOrder - b.unlockOrder),
    [allProvinces]
  );
  const currentIdx = sortedProvinces.findIndex((p: any) => p.id === id);
  const nextProvince = currentIdx >= 0 && currentIdx < sortedProvinces.length - 1 ? sortedProvinces[currentIdx + 1] : null;
  const exercises = lesson?.exercises ?? [];
  const allDone = vocabDone && grammarDone && practiceDone;

  const handleCompleteLesson = useCallback(async () => {
    try { await completeProvince({ variables: { provinceId: id } }); } catch {}
    setView('done');
    toast.success('Lesson completed!');
  }, [completeProvince, id]);

  // ====== RENDER: loading / not found ======
  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (!lesson) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Lesson not found.</p></div>;

  // ====== SIDEBAR NAV ITEMS ======
  const navItems = [
    { key: lesson.storyContent ? 'story' : 'hub', Icon: ScrollText, label: 'Story', count: null },
    { key: 'vocab-ref', Icon: Library, label: 'Words', count: lesson.vocabulary?.length ?? 0 },
    { key: 'grammar-ref', Icon: Languages, label: 'Grammar', count: lesson.grammar?.length ?? 0 },
    { key: 'practice', Icon: PenTool, label: 'Practice', count: exercises.length },
  ];

  const currentView = view === 'story' || view === 'hub' ? navItems[0].key : view;

  // ====== RENDER ======
  const sidebar = (
    <div className="w-52 shrink-0 border-r bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 h-screen sticky top-0 overflow-y-auto hidden md:flex flex-col">
      {/* Lesson header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lesson {lesson.unlockOrder}</p>
        <h2 className="font-bold text-sm mt-0.5">{lesson.name}</h2>
        <Badge variant="outline" className="text-[10px] mt-1">{lesson.capital}</Badge>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all text-left ${
              currentView === item.key
                ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-semibold border-r-2 border-red-500'
                : 'text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <item.Icon className="w-4 h-4" />
            <span className="flex-1">{item.label}</span>
            {item.count !== null && item.count > 0 && (
              <span className="text-xs text-muted-foreground">{item.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <Link href="/lessons" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> All Lessons
        </Link>
        {allDone && (
          <Button size="sm" className="w-full mt-2 rounded-xl text-xs" onClick={() => setView('culture')}>
            <Trophy className="w-3 h-3 mr-1" /> Finish Lesson
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex">
      {sidebar}

      {/* Mobile nav — horizontal tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around py-2 px-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[10px] transition-all ${
              currentView === item.key
                ? 'text-red-600 font-semibold'
                : 'text-muted-foreground'
            }`}
          >
            <item.Icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 md:pb-0 pb-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Mobile-only top bar */}
          <div className="md:hidden flex items-center justify-between mb-6">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lesson {lesson.unlockOrder}</span>
            <Badge variant="outline" className="text-xs">{lesson.capital}</Badge>
          </div>

      {/* ======== HUB SCREEN (no story, or user exits story) ======== */}
      {(view === 'hub' || (view === 'story' && !lesson.storyContent)) && (
        <div className="space-y-6">
          {/* Lesson header */}
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lesson {lesson.unlockOrder}</span>
              <Badge variant="outline" className="text-sm">{lesson.capital}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-3">{lesson.name}</h1>
            {lesson.imageUrl && (
              <div className="mb-4 -mx-6 sm:-mx-0 sm:rounded-2xl overflow-hidden">
                <img
                  src={lesson.imageUrl}
                  alt={lesson.name}
                  className="w-full h-48 sm:h-64 object-cover sm:rounded-2xl"
                />
              </div>
            )}
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
              {lesson.culturalDescription}
            </p>
          </div>

          {/* Story Mode Banner */}
          {lesson.storyContent && (
            <Card
              className="relative overflow-hidden rounded-2xl border-2 border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/20 dark:to-amber-950/20 cursor-pointer hover:shadow-lg transition-all mb-6"
              onClick={() => setView('story')}
            >
              <div className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0 shadow-inner">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Badge className="mb-1 bg-red-500 text-white">Story Mode</Badge>
                  <h3 className="text-lg font-bold mb-1">Lily&apos;s Journey</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn Chinese through Lily&apos;s adventure in {lesson.name}. An interactive story with dialogue, new words, and quizzes.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-red-500 shrink-0" />
              </div>
            </Card>
          )}

          {/* 3 Activity cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Vocabulary card */}
            <Card
              className={`p-5 text-center cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border rounded-2xl ${
                vocabDone ? 'border-green-500/20 bg-green-500/[0.03]' : 'border-border bg-card/65 hover:border-primary/20 shadow-sm'
              }`}
              onClick={() => setView('vocab')}
            >
              {vocabDone ? (
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Library className="w-5 h-5" />
                </div>
              )}
              <h3 className="font-bold text-lg mb-1">Vocabulary</h3>
              <p className="text-sm text-muted-foreground mb-2 font-light">
                {studiedWordIds.size > 0
                  ? `${studiedWordIds.size}/${lesson.vocabulary?.length ?? 0} studied`
                  : `${lesson.vocabulary?.length ?? 0} words`}
              </p>
              {studiedWordIds.size > 0 && (
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(studiedWordIds.size / (lesson.vocabulary?.length ?? 1)) * 100}%` }} />
                </div>
              )}
              <Button variant={vocabDone ? 'outline' : 'default'} size="sm" className="rounded-xl font-semibold">
                {vocabDone ? 'Review' : studiedWordIds.size > 0 ? 'Continue' : 'Study'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Card>

            {/* Grammar card */}
            <Card
              className={`p-5 text-center cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border rounded-2xl ${
                grammarDone ? 'border-green-500/20 bg-green-500/[0.03]' : 'border-border bg-card/65 hover:border-primary/20 shadow-sm'
              }`}
              onClick={() => setView('grammar')}
            >
              {grammarDone ? (
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Languages className="w-5 h-5" />
                </div>
              )}
              <h3 className="font-bold text-lg mb-1">Grammar</h3>
              <p className="text-sm text-muted-foreground mb-3 font-light">
                {lesson.grammar?.length ?? 0} points
              </p>
              <Button variant={grammarDone ? 'outline' : 'default'} size="sm" className="rounded-xl font-semibold">
                {grammarDone ? 'Review' : 'Learn'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Card>

            {/* Practice card */}
            <Card
              className={`p-5 text-center cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border rounded-2xl ${
                practiceDone ? 'border-green-500/20 bg-green-500/[0.03]' : 'border-border bg-card/65 hover:border-primary/20 shadow-sm'
              }`}
              onClick={() => setView('practice')}
            >
              {practiceDone ? (
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <PenTool className="w-5 h-5" />
                </div>
              )}
              <h3 className="font-bold text-lg mb-1">Practice</h3>
              <p className="text-sm text-muted-foreground mb-3 font-light">
                {exercises.length} questions
                {practiceDone && ` · Score: ${practiceScore}/${practiceTotal}`}
              </p>
              <Button variant={practiceDone ? 'outline' : 'default'} size="sm" className="rounded-xl font-semibold">
                {practiceDone ? 'Retry' : 'Start'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Card>
          </div>

          {/* Cultural preview */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3.5 rounded-2xl bg-red-500/5 dark:bg-red-500/[0.02] border border-red-500/10 flex flex-col justify-center items-center">
              <Building2 className="w-5 h-5 text-primary mb-1.5" />
              <p className="text-[11px] font-semibold text-foreground tracking-tight line-clamp-1">{lesson.landmark}</p>
            </div>
            <div className="text-center p-3.5 rounded-2xl bg-orange-500/5 dark:bg-orange-500/[0.02] border border-orange-500/10 flex flex-col justify-center items-center">
              <ChefHat className="w-5 h-5 text-orange-600 mb-1.5" />
              <p className="text-[11px] font-semibold text-foreground tracking-tight line-clamp-1">{lesson.food}</p>
            </div>
            <div className="text-center p-3.5 rounded-2xl bg-blue-500/5 dark:bg-blue-500/[0.02] border border-blue-500/10 flex flex-col justify-center items-center">
              <ScrollText className="w-5 h-5 text-blue-600 mb-1.5" />
              <p className="text-[11px] font-semibold text-foreground tracking-tight line-clamp-1">Local Custom</p>
            </div>
          </div>

          {/* Complete button (when all done) */}
          {allDone && (
            <div className="text-center pt-2">
              <Button size="lg" className="text-lg px-10 h-14 rounded-2xl" onClick={() => setView('culture')}>
                See Your Cultural Reward <Trophy className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ======== STORY MODE ======== */}
      {(view === 'story' || (view === 'hub' && lesson.storyContent)) && lesson.storyContent && (
        <div>
          <StoryPlayer
            storyContent={lesson.storyContent}
            provinceName={lesson.name}
            provinceColor={lesson.color}
            provinceImage={lesson.imageUrl}
            onComplete={() => { setVocabDone(true); setView('hub'); }}
            onExit={() => setView('hub')}
          />
        </div>
      )}

      {/* ======== VOCAB REFERENCE ======== */}
      {view === 'vocab-ref' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Word List
          </h2>
          <p className="text-muted-foreground mb-4">All words from this lesson for quick reference.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {(lesson.vocabulary ?? []).map((word: any) => (
              <Link key={word.id} href={`/vocabulary/${word.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 hover:border-red-200 hover:shadow-sm transition-all cursor-pointer">
                  <PronounceButton text={word.character} />
                  <div className="min-w-0 flex-1">
                    <span className="text-lg font-bold cn-display">{word.character}</span>
                    <span className="text-sm text-muted-foreground ml-2">{word.pinyin}</span>
                    <p className="text-sm font-medium">{word.english}</p>
                  </div>
                  <SaveWordButton wordId={word.id} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ======== GRAMMAR REFERENCE ======== */}
      {view === 'grammar-ref' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">📐 Grammar Reference</h2>
          <div className="space-y-4">
            {(lesson.grammar ?? []).map((g: any) => (
              <Card key={g.id} className="p-5">
                <h3 className="font-semibold text-lg mb-2">{g.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">{g.explanation}</p>
                <div className="space-y-2">
                  {JSON.parse(g.examples).map((ex: any, i: number) => (
                    <div key={i} className="bg-muted/50 p-3 rounded-lg text-sm">
                      <p className="text-lg font-medium cn-display">{ex.chinese}</p>
                      <p className="text-muted-foreground">{ex.pinyin}</p>
                      <p className="text-muted-foreground italic">{ex.english}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ======== VOCABULARY (flashcard mode from hub) ======== */}
      {view === 'vocab' && (
        <div className="space-y-4">
          <VocabBatch
            key={`vocab-${lesson.id}`}
            words={lesson.vocabulary ?? []}
            batchIndex={0}
            totalBatches={1}
            onReviewWord={(wordId, correct) => {
              reviewWord({ variables: { wordId, correct } }).catch(() => {});
            }}
            onComplete={() => { setVocabDone(true); setView('hub'); }}
          />
        </div>
      )}

      {/* ======== GRAMMAR (interactive mode from hub) ======== */}
      {view === 'grammar' && (
        <div className="space-y-4">
          {(lesson.grammar?.length ?? 0) > 0 ? (
            <LessonGrammarCard
              key={`grammar-${lesson.id}`}
              grammar={lesson.grammar![0]}
              index={0}
              total={lesson.grammar!.length}
              provinceColor={lesson.color}
              onComplete={() => { setGrammarDone(true); setView('hub'); }}
            />
          ) : (
            <Card className="p-8 text-center"><p className="text-muted-foreground">No grammar in this lesson.</p><Button onClick={() => { setGrammarDone(true); setView('hub'); }}>Back to lesson</Button></Card>
          )}
        </div>
      )}

      {/* ======== PRACTICE (from hub or story) ======== */}
      {view === 'practice' && (
        <div className="space-y-4">
          <LessonPractice
            key={`practice-${lesson.id}`}
            exercises={exercises}
            onSubmitAnswer={async (exerciseId, answer) => {
              const { data: result } = await submitAnswer({ variables: { exerciseId, answer, provinceId: id } });
              return result!.submitAnswer;
            }}
            onComplete={(score, total) => {
              setPracticeScore(score);
              setPracticeTotal(total);
              setPracticeDone(true);
              setView('hub');
            }}
          />
        </div>
      )}

      {/* ======== CULTURAL REWARD ======== */}
      {view === 'culture' && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h2 className="text-3xl font-extrabold text-center mb-2">Cultural Discovery</h2>
            <p className="text-center text-muted-foreground font-light text-sm">Your rewards for exploring {lesson.name}.</p>
          </div>
          <Card className="p-6 sm:p-8 bg-card/85 backdrop-blur-sm border rounded-3xl shadow-lg shadow-red-950/[0.02]">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mt-3">{lesson.landmark}</h3>
              <p className="text-base text-muted-foreground mt-2 leading-relaxed max-w-lg mx-auto font-light">{lesson.landmarkFact}</p>
            </div>
            <Separator className="my-6" />
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mt-3">{lesson.food}</h3>
              <p className="text-base text-muted-foreground mt-2 leading-relaxed max-w-lg mx-auto font-light">{lesson.foodDescription}</p>
            </div>
            <Separator className="my-6" />
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <ScrollText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mt-3">Local Custom</h3>
              <p className="text-base text-muted-foreground mt-2 leading-relaxed max-w-lg mx-auto font-light">{lesson.custom}</p>
            </div>
          </Card>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="lg" onClick={() => setView('hub')} className="rounded-2xl">Back to lesson</Button>
            <Button size="lg" onClick={handleCompleteLesson} className="rounded-2xl btn-premium bg-primary text-primary-foreground">Complete Lesson <Trophy className="w-5 h-5 ml-2" /></Button>
          </div>
        </div>
      )}

      {/* ======== DONE ======== */}
      {view === 'done' && (
        <div className="space-y-6">
          <Card className="p-8 text-center bg-gradient-to-br from-red-50 via-amber-50 to-red-50 dark:from-red-950/10 dark:via-amber-950/10 dark:to-red-950/10 border-2 border-red-200 dark:border-red-900/30">
            <Trophy className="w-16 h-16 mx-auto text-amber-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Lesson Complete!</h1>
            <p className="text-lg text-muted-foreground mb-6">You&apos;ve explored {lesson.name} and mastered new skills!</p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-white/60 dark:bg-zinc-800/60 rounded-xl p-3"><p className="text-2xl font-bold text-red-600">{lesson.vocabulary?.length ?? 0}</p><p className="text-xs text-muted-foreground">Words</p></div>
              <div className="bg-white/60 dark:bg-zinc-800/60 rounded-xl p-3"><p className="text-2xl font-bold text-red-600">{lesson.grammar?.length ?? 0}</p><p className="text-xs text-muted-foreground">Grammar</p></div>
              <div className="bg-white/60 dark:bg-zinc-800/60 rounded-xl p-3"><p className="text-2xl font-bold text-red-600">{practiceScore}/{practiceTotal}</p><p className="text-xs text-muted-foreground">Score</p></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/lessons"><Button variant="outline" size="lg">Back to Lessons</Button></Link>
              {nextProvince && (<Link href={`/lessons/${nextProvince.id}`}><Button size="lg">Next: {nextProvince.name} <ChevronRight className="w-4 h-4 ml-1" /></Button></Link>)}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Quick Review
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {lesson.vocabulary?.slice(0, 8).map((w: any) => (<div key={w.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"><PronounceButton text={w.character} /><span className="text-lg font-bold cn-display">{w.character}</span><span className="text-sm text-muted-foreground ml-auto">{w.english}</span></div>))}
            </div>
          </Card>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
