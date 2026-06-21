'use client';

import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PronounceButton } from '@/components/pronounce-button';
import { SaveWordButton } from '@/components/save-word-button';
import { Loader2, Search, Volume2 } from 'lucide-react';
import Link from 'next/link';

const VOCABULARY_QUERY = gql`
  query Vocabulary {
    vocabulary {
      id
      character
      pinyin
      english
      category
    }
  }
`;

export default function VocabularyPage() {
  const { data, loading } = useQuery(VOCABULARY_QUERY);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const words = (data?.vocabulary ?? []) as any[];
  const categories = [...new Set(words.map((w: any) => w.category))] as string[];

  // Strip tone marks from pinyin for accent-insensitive search
  const stripTones = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Simple fuzzy: check if query characters appear in order (subsequence match)
  const fuzzyMatch = (text: string, query: string): boolean => {
    let ti = 0;
    for (let qi = 0; qi < query.length && ti < text.length; ti++) {
      if (text[ti] === query[qi]) qi++;
      if (qi === query.length) return true;
    }
    return false;
  };

  const filtered = words.filter((w: any) => {
    const q = search.toLowerCase().trim();
    if (!q) return !selectedCategory || w.category === selectedCategory;

    const plainPinyin = stripTones(w.pinyin).toLowerCase();
    const plainEnglish = w.english.toLowerCase();

    const matchesSearch =
      w.character.includes(search) ||
      w.pinyin.toLowerCase().includes(q) ||
      plainPinyin.includes(q) ||
      plainEnglish.includes(q) ||
      // Fuzzy: subsequence match on pinyin and english
      fuzzyMatch(plainPinyin, q) ||
      fuzzyMatch(plainEnglish, q);
    const matchesCategory = !selectedCategory || w.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Vocabulary</h1>
          <p className="text-muted-foreground">
            All 150 HSK 1 words — click{' '}
            <Volume2 className="w-3.5 h-3.5 inline text-red-600" /> to hear pronunciation.{' '}
            <Link href="/pinyin" className="text-red-600 hover:underline">Pinyin guide →</Link>
          </p>
        </div>
      </div>

      {/* Search & filter */}
      <div className="space-y-3 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search 150 words by character, pinyin, or English..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus-visible:border-red-300 focus-visible:ring-red-100"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer px-3 py-1.5 text-sm rounded-full"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1.5 text-sm rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Word grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map((word: any) => (
          <Link key={word.id} href={`/vocabulary/${word.id}`}>
            <Card className="p-4 flex items-center justify-between hover:border-red-300 hover:shadow-md transition-all cursor-pointer group card-hover">
              <div className="flex items-center gap-3">
                <PronounceButton text={word.character} size="md" />
                <div>
                  <span className="text-2xl font-bold cn-display">{word.character}</span>
                  <span className="text-base text-muted-foreground ml-2 font-medium">{word.pinyin}</span>
                </div>
              </div>
              <div className="text-right flex items-center gap-2">
                <SaveWordButton wordId={word.id} />
                <p className="text-base font-semibold">{word.english}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-10">No words match your search.</p>
      )}
    </div>
  );
}
