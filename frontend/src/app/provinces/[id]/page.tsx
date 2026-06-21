'use client';

import { useParams } from 'next/navigation';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PronounceButton } from '@/components/pronounce-button';
import { Loader2, MapPin, ChefHat, Landmark, ScrollText, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const PROVINCE_QUERY = gql`
  query Province($id: ID!) {
    province(id: $id) {
      id
      name
      capital
      culturalDescription
      landmark
      landmarkFact
      food
      foodDescription
      custom
      color
      vocabulary { id character pinyin english category travelSentence }
      grammar { id title explanation examples }
      exercises { id type question questionLabel options correctAnswer }
    }
  }
`;

const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer($exerciseId: String!, $answer: String!, $provinceId: ID!) {
    submitAnswer(exerciseId: $exerciseId, answer: $answer, provinceId: $provinceId) {
      correct
      correctAnswer
    }
  }
`;

export default function ProvinceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery(PROVINCE_QUERY, { variables: { id } });
  const [submitAnswer] = useMutation(SUBMIT_ANSWER);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const province = data?.province;
  if (!province) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-red-600">Province not found.</p></div>;
  }

  const handleAnswer = async (exerciseId: string, answer: string) => {
    try {
      const { data: result } = await submitAnswer({
        variables: { exerciseId, answer, provinceId: id },
      });
      setAnswers((prev) => ({ ...prev, [exerciseId]: result!.submitAnswer }));
    } catch { toast.error('Failed to submit. Are you logged in?'); }
  };

  const renderExamples = (examplesJson: string) => {
    const examples = JSON.parse(examplesJson);
    return (
      <ul className="space-y-2 mt-2">
        {examples.map((ex: any, i: number) => (
          <li key={i} className="bg-muted p-3 rounded text-sm">
            <p className="text-lg font-medium">{ex.chinese}</p>
            <p className="text-muted-foreground">{ex.pinyin}</p>
            <p className="text-muted-foreground italic">{ex.english}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Province Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: province.color }} />
          <Badge variant="outline">{province.capital}</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-3">{province.name}</h1>
        <p className="text-muted-foreground leading-relaxed">{province.culturalDescription}</p>
      </div>

      {/* Cultural Highlights */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <Card className="p-4 bg-red-50 dark:bg-red-950/20">
          <Landmark className="w-5 h-5 text-red-600 mb-2" />
          <h3 className="font-semibold text-sm mb-1">{province.landmark}</h3>
          <p className="text-xs text-muted-foreground">{province.landmarkFact}</p>
        </Card>
        <Card className="p-4 bg-orange-50 dark:bg-orange-950/20">
          <ChefHat className="w-5 h-5 text-orange-600 mb-2" />
          <h3 className="font-semibold text-sm mb-1">{province.food}</h3>
          <p className="text-xs text-muted-foreground">{province.foodDescription}</p>
        </Card>
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
          <ScrollText className="w-5 h-5 text-blue-600 mb-2" />
          <h3 className="font-semibold text-sm mb-1">Local Custom</h3>
          <p className="text-xs text-muted-foreground">{province.custom}</p>
        </Card>
      </div>

      {/* Learning Tabs */}
      <Tabs defaultValue="vocabulary">
        <TabsList className="mb-6">
          <TabsTrigger value="vocabulary">📖 Vocabulary</TabsTrigger>
          <TabsTrigger value="grammar">📐 Grammar</TabsTrigger>
          <TabsTrigger value="exercises">✏️ Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="vocabulary">
          <div className="grid gap-2">
            {province.vocabulary.map((word: any) => (
              <Card key={word.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PronounceButton text={word.character} />
                  <div>
                    <span className="text-xl font-medium">{word.character}</span>
                    <span className="text-xs text-muted-foreground ml-2">{word.pinyin}</span>
                  </div>
                </div>
                <div className="text-right flex-1 ml-4">
                  <p className="font-medium text-sm">{word.english}</p>
                  {word.travelSentence && (
                    <p className="text-xs text-muted-foreground italic mt-0.5">
                      &ldquo;{word.travelSentence}&rdquo;
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grammar">
          <div className="space-y-4">
            {province.grammar.map((g: any) => (
              <Card key={g.id} className="p-5">
                <h3 className="font-semibold text-lg mb-2">{g.title}</h3>
                <p className="text-muted-foreground">{g.explanation}</p>
                <Separator className="my-3" />
                {renderExamples(g.examples)}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exercises">
          <div className="space-y-4">
            {province.exercises.map((ex: any) => {
              const ans = answers[ex.id];
              const options: string[] = JSON.parse(ex.options);

              return (
                <Card key={ex.id} className="p-5">
                  <p className="font-medium mb-1">{ex.questionLabel}</p>
                  <p className="text-lg mb-4">{ex.question}</p>

                  {ans ? (
                    <div className={`flex items-center gap-2 p-3 rounded ${ans.correct ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                      {ans.correct ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                      <span>{ans.correct ? 'Correct!' : `Answer: ${ans.correctAnswer}`}</span>
                    </div>
                  ) : ex.type === 'CULTURAL' || ex.type === 'MULTIPLE_CHOICE' ? (
                    <div className="grid grid-cols-2 gap-2">
                      {options.map((opt: string) => (
                        <Button key={opt} variant="outline" className="justify-start" onClick={() => handleAnswer(ex.id, opt)}>
                          {opt}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full bg-background"
                      placeholder="Type your answer..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAnswer(ex.id, (e.target as HTMLInputElement).value);
                      }}
                    />
                  )}
                </Card>
              );
            })}
            {province.exercises.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No exercises yet for this province.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
