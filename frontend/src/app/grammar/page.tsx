'use client';

import { gql, useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

const GRAMMAR_QUERY = gql`
  query Grammar {
    grammar {
      id
      title
      explanation
      examples
    }
  }
`;

function GrammarExamples({ examplesJson }: { examplesJson: string }) {
  const examples = JSON.parse(examplesJson);
  return (
    <ul className="space-y-2">
      {examples.map((ex: any, i: number) => (
        <li key={i} className="bg-muted p-3 rounded text-sm">
          <p className="text-lg font-medium">{ex.chinese}</p>
          <p className="text-muted-foreground">{ex.pinyin}</p>
          <p className="text-muted-foreground italic">{ex.english}</p>
        </li>
      ))}
    </ul>
  );
}

export default function GrammarPage() {
  const { data, loading } = useQuery(GRAMMAR_QUERY);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Grammar Reference</h1>
      <p className="text-muted-foreground mb-8">
        Key grammar points for HSK 1 — all the patterns you need to form simple sentences.
      </p>

      <div className="space-y-4">
        {(data?.grammar ?? []).map((g: any) => (
          <Card key={g.id} className="p-5">
            <h2 className="font-semibold text-lg mb-2">{g.title}</h2>
            <p className="text-muted-foreground">{g.explanation}</p>
            <Separator className="my-4" />
            <p className="text-sm font-medium mb-2">Examples:</p>
            <GrammarExamples examplesJson={g.examples} />
          </Card>
        ))}
      </div>
    </div>
  );
}
