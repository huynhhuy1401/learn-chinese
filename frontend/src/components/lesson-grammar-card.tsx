'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface GrammarExample {
  chinese: string;
  pinyin: string;
  english: string;
}

interface GrammarPoint {
  id: string;
  title: string;
  explanation: string;
  examples: string; // JSON string of GrammarExample[]
}

interface LessonGrammarCardProps {
  grammar: GrammarPoint;
  index: number;
  total: number;
  onComplete: () => void;
  provinceColor: string;
}

export function LessonGrammarCard({
  grammar,
  index,
  total,
  onComplete,
  provinceColor,
}: LessonGrammarCardProps) {
  const [phase, setPhase] = useState<'learn' | 'practice' | 'done'>('learn');
  const examples: GrammarExample[] = JSON.parse(grammar.examples);

  // Generate mini-practice from examples
  const miniQuestions = examples.slice(0, 2).map((ex) => {
    const allExamples: GrammarExample[] = JSON.parse(grammar.examples);
    const wrongAnswers = allExamples
      .filter((e) => e.english !== ex.english)
      .map((e) => e.english)
      .slice(0, 3);
    return {
      question: ex.chinese,
      correctAnswer: ex.english,
      options: [...wrongAnswers, ex.english].sort(() => Math.random() - 0.5),
    };
  });

  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const answeredCount = Object.keys(answers).length;

  if (phase === 'learn') {
    return (
      <Card className="p-6 sm:p-8">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Grammar {index + 1} of {total}
        </p>
        <h2 className="text-2xl font-bold mb-2">{grammar.title}</h2>
        <p className="text-muted-foreground text-base leading-relaxed mb-6">
          {grammar.explanation}
        </p>

        <Separator className="mb-4" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Examples
        </p>

        <div className="space-y-3 mb-6">
          {examples.map((ex, i) => (
            <div key={i} className="bg-muted/50 p-4 rounded-xl">
              <p className="text-2xl font-bold cn-display">{ex.chinese}</p>
              <p className="text-base text-muted-foreground mt-1">{ex.pinyin}</p>
              <p className="text-base text-muted-foreground italic">{ex.english}</p>
            </div>
          ))}
        </div>

        <Button onClick={() => setPhase('practice')} className="w-full sm:w-auto">
          Practice This <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Card>
    );
  }

  if (phase === 'practice') {
    return (
      <Card className="p-6 sm:p-8">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Grammar Practice {index + 1} of {total}
        </p>
        <h2 className="text-lg font-bold mb-6">Test your understanding</h2>

        <div className="space-y-6">
          {miniQuestions.map((q, qi) => {
            const ans = answers[qi];
            return (
              <div key={qi}>
                <p className="text-sm text-muted-foreground mb-2">
                  What does this mean?
                </p>
                <p className="text-2xl font-bold cn-display mb-3">{q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const isCorrect = opt === q.correctAnswer;
                    const selected = ans !== undefined && ans === (opt === q.correctAnswer);
                    return (
                      <Button
                        key={opt}
                        variant="outline"
                        size="sm"
                        className={`justify-start h-auto py-2 px-3 text-sm ${
                          ans !== undefined
                            ? isCorrect
                              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                              : ans === false && opt === q.correctAnswer
                                ? 'border-green-500'
                                : 'opacity-50'
                            : ''
                        }`}
                        onClick={() => {
                          if (ans !== undefined) return;
                          const correct = opt === q.correctAnswer;
                          setAnswers((prev) => ({ ...prev, [qi]: correct }));
                        }}
                        disabled={ans !== undefined}
                      >
                        {ans !== undefined && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />
                        )}
                        {opt}
                      </Button>
                    );
                  })}
                </div>
                {ans !== undefined && (
                  <p className={`text-sm mt-2 ${ans ? 'text-green-600' : 'text-red-500'}`}>
                    {ans ? '✓ Correct!' : `✗ Answer: ${q.correctAnswer}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {answeredCount === miniQuestions.length && (
          <div className="mt-6 text-center">
            <Button onClick={() => setPhase('done')}>
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>
    );
  }

  // Done
  return (
    <Card className="p-6 sm:p-8 text-center">
      <Lightbulb className="w-10 h-10 mx-auto text-amber-500 mb-3" />
      <h3 className="text-xl font-bold mb-2">Grammar Complete!</h3>
      <p className="text-muted-foreground mb-6">
        You&apos;ve mastered <strong>{grammar.title}</strong>
      </p>
      <Button onClick={onComplete} size="lg">
        Continue <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </Card>
  );
}
