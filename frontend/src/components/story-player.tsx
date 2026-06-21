'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PronounceButton } from '@/components/pronounce-button';
import { ChevronRight, ArrowRight, MessageCircle, BookOpen, CheckCircle2, XCircle, Sparkles, BookHeart } from 'lucide-react';

interface StoryScene {
  type: 'intro' | 'scene' | 'learn' | 'quiz' | 'end';
  title: string;
  narrative: string;
  speaker: string;
  mood: string;
  dialogue: string;
  words?: { character: string; pinyin: string; english: string; context: string }[];
  question?: string;
  options?: string[];
  answer?: string;
  feedback?: string;
}

interface StoryPlayerProps {
  storyContent: string; // JSON string of StoryScene[]
  provinceName: string;
  provinceColor: string;
  provinceImage?: string | null;
  onComplete: () => void;
  onExit: () => void;
}

export function StoryPlayer({ storyContent, provinceName, provinceColor, provinceImage, onComplete, onExit }: StoryPlayerProps) {
  const [scenes] = useState<StoryScene[]>(() => {
    try { return JSON.parse(storyContent); }
    catch { return []; }
  });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [visible, setVisible] = useState(true);

  const scene = scenes[sceneIdx];
  const progress = ((sceneIdx + 1) / scenes.length) * 100;

  const advance = () => {
    setVisible(false);
    setTimeout(() => {
      if (sceneIdx < scenes.length - 1) {
        setSceneIdx((i) => i + 1);
        setQuizAnswered(false);
        setQuizCorrect(false);
      }
      setVisible(true);
    }, 250);
  };

  const handleQuizAnswer = (option: string) => {
    const correct = option === scene.answer;
    setQuizCorrect(correct);
    setQuizAnswered(true);
  };

  const moods: Record<string, string> = {
    nervous: '😰',
    helpful: '😊',
    hopeful: '🌟',
    focused: '🤔',
    warm: '☕',
    grateful: '🥹',
    reflective: '📝',
  };

  if (!scene) return null;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: provinceColor }} />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{sceneIdx + 1}/{scenes.length}</span>
      </div>

      {/* Scene card */}
      <div className="transition-all duration-300" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}>
        {/* INTRO / SCENE */}
        {(scene.type === 'intro' || scene.type === 'scene') && (
          <Card className="overflow-hidden rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900">
            {provinceImage && (
              <div className="h-40 overflow-hidden">
                <img src={provinceImage} alt={provinceName} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{moods[scene.mood] || '📍'}</span>
                <Badge variant="secondary" className="capitalize">{scene.speaker}</Badge>
              </div>
              <h2 className="text-xl font-bold mb-4">{scene.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{scene.narrative}</p>

              {/* Dialogue bubble */}
              <div className="relative bg-[#e8f0fe] dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
                <MessageCircle className="absolute -top-3 left-4 w-6 h-6 text-blue-400" />
                {scene.dialogue.split('\n').map((line, i) => (
                  <p key={i} className={`text-base leading-relaxed ${line.startsWith('Lily:') ? 'font-medium' : 'text-muted-foreground'}`}>
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button onClick={advance} size="lg" className="rounded-2xl px-8">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* LEARN */}
        {scene.type === 'learn' && scene.words && (
          <div className="space-y-4">
            <Card className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{moods[scene.mood] || '📖'}</span>
                <Badge variant="secondary" className="capitalize">{scene.speaker}</Badge>
              </div>
              <h2 className="text-xl font-bold mb-3">{scene.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{scene.narrative}</p>

              {/* Dialogue */}
              <div className="relative bg-[#e8f0fe] dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30 mb-6">
                <MessageCircle className="absolute -top-3 left-4 w-6 h-6 text-blue-400" />
                {scene.dialogue.split('\n').map((line, i) => (
                  <p key={i} className={`text-base leading-relaxed ${line.startsWith('Lily:') || line.startsWith("Stranger:") || line.startsWith("Auntie Zhang:") ? 'font-medium cn-display' : 'text-muted-foreground'}`}>
                    {line}
                  </p>
                ))}
              </div>

              {/* New words */}
              <div className="space-y-3">
                <p className="text-sm font-semibold flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> New Words
                </p>
                {scene.words.map((word, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                    <PronounceButton text={word.character} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold cn-display">{word.character}</span>
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">{word.pinyin}</span>
                      </div>
                      <p className="text-base font-semibold">{word.english}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 italic">{word.context}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button onClick={advance} size="lg" className="rounded-2xl px-8">
                  Got it <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* QUIZ */}
        {scene.type === 'quiz' && (
          <Card className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✏️</span>
              <Badge variant="secondary">Quiz</Badge>
            </div>
            <h2 className="text-xl font-bold mb-3">{scene.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{scene.narrative}</p>

            {/* Dialogue */}
            <div className="relative bg-[#e8f0fe] dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30 mb-6">
              <MessageCircle className="absolute -top-3 left-4 w-6 h-6 text-blue-400" />
              {scene.dialogue?.split('\n').map((line, i) => (
                <p key={i} className={`text-base leading-relaxed ${line.includes(':') ? 'font-medium' : 'text-muted-foreground'}`}>
                  {line}
                </p>
              ))}
            </div>

            <p className="text-lg font-semibold mb-4">{scene.question}</p>

            {!quizAnswered ? (
              <div className="grid grid-cols-2 gap-3">
                {scene.options?.map((opt) => (
                  <Button key={opt} variant="outline" className="h-auto py-4 px-4 text-base justify-start rounded-xl border-2 hover:border-red-300"
                    onClick={() => handleQuizAnswer(opt)}>
                    {opt}
                  </Button>
                ))}
              </div>
            ) : (
              <div>
                <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${
                  quizCorrect ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                }`}>
                  {quizCorrect ? <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" /> : <XCircle className="w-6 h-6 text-red-600 shrink-0" />}
                  <div>
                    <p className="font-semibold text-base">{quizCorrect ? 'Correct! 🎉' : 'Not quite'}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 cn-display">{scene.answer}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4 italic">{scene.feedback}</p>
                <Button onClick={advance} size="lg" className="w-full rounded-2xl">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* END */}
        {scene.type === 'end' && (
          <Card className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950/20 dark:to-amber-950/20 p-8 text-center">
              <BookHeart className="w-16 h-16 mx-auto text-red-400 mb-4" />
              <h1 className="text-3xl font-bold mb-2">{scene.title}</h1>
              <p className="text-muted-foreground mb-6">{scene.narrative}</p>

              <div className="bg-white/80 dark:bg-zinc-800/80 rounded-2xl p-6 text-left max-w-md mx-auto">
                {scene.dialogue.split('\n').map((line, i) => (
                  <p key={i} className={`text-base leading-relaxed mb-2 ${line.includes(':') ? 'font-medium' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" size="lg" onClick={onExit} className="rounded-2xl">
                  Back to Lesson
                </Button>
                <Button size="lg" onClick={onComplete} className="rounded-2xl">
                  Mark as Complete <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
