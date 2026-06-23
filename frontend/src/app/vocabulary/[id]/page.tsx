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
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-down">
      <Link href="/vocabulary" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to vocabulary
      </Link>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Left column: Hero + Pronunciation */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 text-center bg-card/70 backdrop-blur-md border rounded-3xl shadow-sm shadow-red-950/[0.01]">
            {word.province && (
              <Badge variant="outline" className="mb-4 text-xs font-semibold px-2.5 py-1" style={{ borderColor: word.province.color, color: word.province.color }}>
                <MapPin className="w-3 h-3 mr-1" /> {word.province.name}
              </Badge>
            )}
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-6xl sm:text-7xl font-extrabold cn-display select-all leading-none">{word.character}</span>
              <PronounceButton text={word.character} size="md" />
            </div>
            <p className="text-2xl text-primary font-bold mb-1">{word.pinyin}</p>
            <p className="text-3xl font-black mb-4 tracking-tight">{word.english}</p>
            <Badge variant="secondary" className="text-xs px-3 py-1 font-semibold">{word.category}</Badge>
          </Card>

          <Card className="p-6 bg-card/70 backdrop-blur-md border rounded-3xl shadow-sm shadow-red-950/[0.01]">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" /> Pronunciation Guide
            </h2>
            <div className="flex items-center gap-3 mb-3 bg-muted/40 p-4 rounded-2xl border">
              <PronounceButton text={word.character} size="md" />
              <div>
                <span className="text-lg font-bold text-primary">{word.pinyin}</span>
                <p className="text-xs text-muted-foreground font-light mt-0.5">Click speaker to hear the word</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-light mt-2 leading-relaxed">
              Tones are critical in Chinese. To review standard vowel sounds, check the full{' '}
              <Link href="/pinyin" className="text-primary font-semibold hover:underline">Pinyin Guide →</Link>
            </p>
          </Card>
        </div>

        {/* Right column: Stroke Order */}
        <Card className="p-6 bg-card/70 backdrop-blur-md border rounded-3xl shadow-sm shadow-red-950/[0.01]">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-primary" /> Stroke Order Animation
          </h2>
          <StrokeOrder character={word.character} />
        </Card>
      </div>

      {/* Usage Examples — full width */}
      <Card className="p-6 bg-card/70 backdrop-blur-md border rounded-3xl shadow-sm shadow-red-950/[0.01] mb-6">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Contextual Usage Examples
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {examples.map((ex, i) => {
            const parts = ex.split('(');
            const chinese = parts[0]?.trim();
            const english = parts[1]?.replace(')', '')?.trim();
            return (
              <div key={i} className="bg-secondary/50 dark:bg-zinc-800/30 rounded-2xl p-5 border shadow-sm hover:border-primary/10 transition-all">
                <p className="text-xl font-bold cn-display text-foreground leading-normal mb-1.5">{chinese}</p>
                {english && <p className="text-sm text-muted-foreground italic font-light leading-relaxed">{english}</p>}
              </div>
            );
          })}
        </div>
        {examples.length === 0 && <p className="text-muted-foreground text-center py-6 font-light">More context sentences coming soon!</p>}
      </Card>

      {/* Related words */}
      {related.length > 0 && (
        <Card className="p-6 bg-card/70 backdrop-blur-md border rounded-3xl shadow-sm shadow-red-950/[0.01]">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" /> Related Words
          </h2>
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-semibold">More words in <span className="text-primary font-bold">{word.category}</span>:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {related.map((rw: any) => (
              <Link key={rw.id} href={`/vocabulary/${rw.id}`}>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl border bg-card/90 hover:border-primary/20 dark:hover:border-primary/30 transition-all card-hover">
                  <span className="text-2xl font-bold cn-display text-foreground">{rw.character}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate leading-tight">{rw.english}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{rw.pinyin}</p>
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
