'use client';

import { useParams } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PronounceButton } from '@/components/pronounce-button';
import { Loader2, ChevronLeft, Volume2, Lightbulb, Info } from 'lucide-react';

const VOCAB_QUERY = gql`
  query AllVocab {
    vocabulary { id character pinyin english category }
    grammar { id title }
  }
`;

// Sound data (initials + finals with tips)
const soundData: Record<string, any> = {
  b: { type: 'initial', tip: 'Lips together, then release. Softer than English b.' },
  p: { type: 'initial', tip: 'Lips together, strong puff of air. More air than English p.' },
  m: { type: 'initial', tip: 'Lips together, hum through nose.' },
  f: { type: 'initial', tip: 'Top teeth on bottom lip.' },
  d: { type: 'initial', tip: 'Tongue tip touches upper ridge. Softer than English d.' },
  t: { type: 'initial', tip: 'Tongue tip on upper ridge, strong puff of air.' },
  n: { type: 'initial', tip: 'Tongue tip on upper ridge, air through nose.' },
  l: { type: 'initial', tip: 'Tongue tip on upper ridge, air flows around sides.' },
  g: { type: 'initial', tip: 'Back of tongue touches soft palate.' },
  k: { type: 'initial', tip: 'Back of tongue on soft palate, strong puff of air.' },
  h: { type: 'initial', tip: 'Back of tongue, raspy friction. Like Scottish "loch".' },
  j: { type: 'initial', tip: 'Tongue against hard palate. Smile slightly. No English equivalent.' },
  q: { type: 'initial', tip: 'Same as j but with strong puff of air.' },
  x: { type: 'initial', tip: 'Same tongue as j/q, continuous air. Smile and hiss.' },
  zh: { type: 'initial', tip: 'Curl tongue tip back. Like English j but tongue curled back.' },
  ch: { type: 'initial', tip: 'Same curled tongue as zh, strong puff of air.' },
  sh: { type: 'initial', tip: 'Same curled tongue. Tongue pointing up, continuous hiss.' },
  r: { type: 'initial', tip: 'Curl tongue back, add voice. No English equivalent.' },
  z: { type: 'initial', tip: 'Tongue tip touches back of front teeth.' },
  c: { type: 'initial', tip: 'Same as z but strong puff of air. Like "ts" in "cats".' },
  s: { type: 'initial', tip: 'Tongue near teeth, continuous hiss.' },
  a: { type: 'final', tip: 'Mouth wide open, tongue low. Like "ah" at the doctor.' },
  o: { type: 'final', tip: 'Lips rounded and protruding. Like "aw" but rounder.' },
  e: { type: 'final', tip: 'Tongue mid-high, back, lips unrounded. No English equivalent.' },
  i: { type: 'final', tip: 'Tongue high, lips spread like a smile. Like "ee" in "see".' },
  u: { type: 'final', tip: 'Lips tightly rounded, tongue high. Like "oo" with more rounding.' },
  ai: { type: 'final', tip: 'a → i. Like "eye" but shorter.' },
  ei: { type: 'final', tip: 'e → i. Like "ay" in "day".' },
  ao: { type: 'final', tip: 'a → o. Like "ow" in "how" but rounder ending.' },
  ou: { type: 'final', tip: 'o → u. Like "oh" with lip rounding at end.' },
  an: { type: 'final', tip: 'a + n. Tongue to upper ridge, air through nose.' },
  en: { type: 'final', tip: 'e + n. Like "un" in "under".' },
  ang: { type: 'final', tip: 'a + ng. Back of tongue to soft palate.' },
  eng: { type: 'final', tip: 'e + ng. Like "ung" in "lung".' },
  ong: { type: 'final', tip: 'o + ng. Rounded lips throughout.' },
  ia: { type: 'final', tip: 'i + a. Like "ya" in "yard".' },
  ie: { type: 'final', tip: 'i + e. Like "ye" in "yes".' },
  ua: { type: 'final', tip: 'u + a. Like "wa" in "water".' },
  uo: { type: 'final', tip: 'u + o. Like "wo" in "wore".' },
  üe: { type: 'final', tip: 'ü + e. Start with rounded lips. Tricky!' },
  iao: { type: 'final', tip: 'i + a + o. Like "yow" in "yowl". Three vowels!' },
  iu: { type: 'final', tip: 'i + ou. Like "yo" with rounded ending.' },
  uai: { type: 'final', tip: 'u + a + i. Like "why" with lip rounding.' },
  ui: { type: 'final', tip: 'u + ei. Like "way" with rounded start.' },
  ian: { type: 'final', tip: 'i + e + n. Like "yen" but more open middle.' },
  uan: { type: 'final', tip: 'u + a + n. Like "wahn".' },
  iang: { type: 'final', tip: 'i + a + ng. Like "yahng". Resonate in nose.' },
  uang: { type: 'final', tip: 'u + a + ng. Like "wahng".' },
};

export default function SoundDetailPage() {
  const { sound } = useParams<{ sound: string }>();
  const decoded = decodeURIComponent(sound ?? '');
  const info = soundData[decoded];
  const { data, loading } = useQuery(VOCAB_QUERY);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!info) return <div className="max-w-xl mx-auto px-4 py-20 text-center text-muted-foreground">Sound not found: {decoded}</div>;

  // Find example words containing this sound
  const words = data?.vocabulary ?? [];
  const examples = words.filter((w: any) => {
    const p = w.pinyin.toLowerCase();
    const s = decoded.toLowerCase();
    // Check if sound appears as a standalone component in pinyin
    // e.g., "sh" matches "shì" and "shàng" but not "s" in "sān"
    return p.includes(s);
  }).slice(0, 20);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in-down">
      <Link href="/pinyin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Pinyin Guide
      </Link>

      {/* Hero */}
      <Card className="p-8 text-center bg-card/70 backdrop-blur-md border rounded-3xl shadow-sm shadow-red-950/[0.01] mb-8">
        <p className="text-7xl sm:text-8xl font-black mb-4 text-primary tracking-tight">{decoded}</p>
        <Badge className="mb-2" variant="secondary">{info.type === 'initial' ? 'Initial (Consonant)' : 'Final (Vowel)'}</Badge>
        <h1 className="text-sm font-medium mt-2 mb-4 text-muted-foreground">How to pronounce the <span className="text-primary font-bold">{decoded}</span> sound</h1>

        <div className="flex items-start gap-3 bg-secondary/80 dark:bg-zinc-800/40 rounded-2xl p-5 border text-left shadow-sm">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold mb-1">Tongue & Mouth Position</p>
            <p className="text-sm text-muted-foreground leading-relaxed font-light">{info.tip}</p>
          </div>
        </div>
      </Card>

      {/* Example Words */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Volume2 className="w-5 h-5 text-primary animate-pulse" /> Example Words
      </h2>
      <p className="text-muted-foreground mb-6 text-sm font-light">
        These HSK 1 vocabulary words use the <span className="font-bold text-foreground">{decoded}</span> sound. Listen to each one and copy the pronunciation.
      </p>

      {examples.length > 0 ? (
        <div className="grid gap-3">
          {examples.map((word: any) => (
            <Link key={word.id} href={`/vocabulary/${word.id}`}>
              <Card className="p-4 flex items-center justify-between bg-card/70 border hover:border-primary/20 transition-all cursor-pointer card-hover shadow-sm shadow-red-950/[0.01]">
                <div className="flex items-center gap-3">
                  <PronounceButton text={word.character} size="md" />
                  <div>
                    <span className="text-lg font-bold text-primary">{word.pinyin}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold cn-display">{word.character}</span>
                      <span className="text-xs text-muted-foreground">— {word.english}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{word.english}</p>
                  <Badge variant="secondary" className="text-[10px] mt-1 font-semibold">{word.category}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-muted-foreground bg-card/70 border rounded-2xl">
          <Lightbulb className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="font-light">No vocabulary words found with this sound yet.</p>
        </Card>
      )}
    </div>
  );
}
