'use client';

import { useParams } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PronounceButton } from '@/components/pronounce-button';
import { StrokeOrder } from '@/components/stroke-order';
import { Loader2, ChevronLeft, MapPin, Volume2, BookOpen, Lightbulb, Grid3X3 } from 'lucide-react';
import Link from 'next/link';

const WORD_QUERY = gql`
  query Word($id: ID!) {
    word(id: $id) {
      id character pinyin english category travelSentence
      province { name color }
    }
    vocabulary {
      id character pinyin english category
    }
  }
`;

// Generate real-life example sentences based on word data
function generateExamples(word: any): string[] {
  const examples: string[] = [];

  if (word.travelSentence) {
    examples.push(word.travelSentence);
  }

  const char = word.character;
  const eng = word.english.toLowerCase();

  // Common patterns based on category
  if (word.category === 'Greetings') {
    if (char.includes('你好')) examples.push('你好！欢迎来中国！(Hello! Welcome to China!)');
    if (char.includes('谢谢')) examples.push('谢谢你的帮助！(Thank you for your help!)');
  }
  if (word.category === 'Verbs') {
    examples.push(`我${char}。(I ${eng}.)`);
    examples.push(`你喜欢${char}吗？(Do you like to ${eng}?)`);
  }
  if (word.category === 'Food') {
    examples.push(`我喜欢吃${char}。(I like to eat ${eng}.)`);
    examples.push(`${char}很好吃。(${eng} is delicious.)`);
  }
  if (word.category === 'Adjectives') {
    examples.push(`这个很${char}。(This is very ${eng}.)`);
  }
  if (word.category === 'Pronouns') {
    examples.push(`${char}是我的朋友。(${eng} is my friend.)`);
  }
  if (word.category === 'Time') {
    examples.push(`${char}是星期一。(${eng} is Monday.)`);
  }
  if (word.category === 'Places') {
    examples.push(`${char}很大。(${eng} is big.)`);
  }
  if (word.category === 'Numbers') {
    examples.push(`我有${char}本书。(I have ${eng} books.)`);
  }

  // Ensure uniqueness and limit
  return [...new Set(examples)].slice(0, 5);
}

export default function WordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery(WORD_QUERY, { variables: { id } });

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  const word = data?.word;
  if (!word) return <div className="max-w-xl mx-auto px-4 py-20 text-center text-muted-foreground">Word not found.</div>;

  const examples = generateExamples(word);
  const allWords = data?.vocabulary ?? [];

  // Find related words (same category, limit 6)
  const related = allWords
    .filter((w: any) => w.category === word.category && w.id !== word.id)
    .slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/vocabulary" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to vocabulary
      </Link>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Left column: Hero + Pronunciation */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 text-center border-2 border-gray-200 dark:border-gray-700 rounded-3xl">
            {word.province && (
              <Badge variant="outline" className="mb-4 text-sm" style={{ borderColor: word.province.color }}>
                <MapPin className="w-3.5 h-3.5 mr-1" /> {word.province.name}
              </Badge>
            )}
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-6xl sm:text-7xl font-bold cn-display">{word.character}</span>
              <PronounceButton text={word.character} size="md" />
            </div>
            <p className="text-2xl text-red-600 dark:text-red-400 font-medium mb-1">{word.pinyin}</p>
            <p className="text-3xl font-bold mb-3">{word.english}</p>
            <Badge variant="secondary" className="text-sm px-3 py-1">{word.category}</Badge>
          </Card>

          <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-3xl">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-red-600" /> Pronunciation
            </h2>
            <div className="flex items-center gap-3 mb-3">
              <PronounceButton text={word.character} size="md" />
              <span className="text-lg font-medium">{word.pinyin}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Click the speaker to hear the pronunciation.{' '}
              <Link href="/pinyin" className="text-red-600 hover:underline">Pinyin guide →</Link>
            </p>
          </Card>
        </div>

        {/* Right column: Stroke Order */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-3xl">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-red-600" /> Stroke Order
          </h2>
          <StrokeOrder character={word.character} />
        </Card>
      </div>

      {/* Usage Examples — full width */}
      <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-3xl mb-6">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-600" /> Usage Examples
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {examples.map((ex, i) => {
            const parts = ex.split('(');
            const chinese = parts[0]?.trim();
            const english = parts[1]?.replace(')', '')?.trim();
            return (
              <div key={i} className="bg-[#e8f0fe] dark:bg-blue-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
                <p className="text-lg font-medium cn-display">{chinese}</p>
                {english && <p className="text-sm text-muted-foreground mt-1 italic">{english}</p>}
              </div>
            );
          })}
        </div>
        {examples.length === 0 && <p className="text-muted-foreground text-center py-4">More examples coming soon!</p>}
      </Card>

      {/* Related words */}
      {related.length > 0 && (
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-3xl">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-red-600" /> Related Words
          </h2>
          <p className="text-sm text-muted-foreground mb-3">More words in <strong>{word.category}</strong>:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {related.map((rw: any) => (
              <Link key={rw.id} href={`/vocabulary/${rw.id}`}>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 transition-colors bg-white dark:bg-zinc-900">
                  <span className="text-xl font-bold cn-display">{rw.character}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{rw.english}</p>
                    <p className="text-[10px] text-muted-foreground">{rw.pinyin}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
