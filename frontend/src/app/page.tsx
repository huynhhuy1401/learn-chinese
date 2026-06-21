import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Sparkles, BookOpen, Trophy } from 'lucide-react';

const lessons = [
  { num: 1, name: 'Beijing', cn: '北京', desc: 'Greetings, introductions & numbers', words: 28, color: 'bg-red-500' },
  { num: 2, name: 'Shaanxi', cn: '陕西', desc: 'Telling time, dates & questions', words: 20, color: 'bg-orange-500' },
  { num: 3, name: 'Sichuan', cn: '四川', desc: 'Food, ordering & adjectives', words: 20, color: 'bg-emerald-500' },
  { num: 4, name: 'Shanghai', cn: '上海', desc: 'Shopping, money & measure words', words: 17, color: 'bg-blue-500' },
  { num: 5, name: 'Yunnan', cn: '云南', desc: 'Weather, nature & locations', words: 16, color: 'bg-violet-500' },
  { num: 6, name: 'Guangdong', cn: '广东', desc: 'Family, work & abilities', words: 17, color: 'bg-pink-500' },
  { num: 7, name: 'Henan', cn: '河南', desc: 'Actions, sports & abilities', words: 13, color: 'bg-amber-500' },
  { num: 8, name: 'Xinjiang', cn: '新疆', desc: 'Travel, directions & transport', words: 15, color: 'bg-cyan-500' },
  { num: 9, name: 'Hong Kong', cn: '香港', desc: 'Review & real-world practice', words: 13, color: 'bg-rose-500' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-red-950/20" />
        {/* Decorative characters */}
        <div className="absolute top-20 right-10 text-[180px] font-bold text-red-100/60 dark:text-red-900/20 select-none pointer-events-none rotate-12">
          学
        </div>
        <div className="absolute bottom-10 left-10 text-[120px] font-bold text-amber-100/60 dark:text-amber-900/20 select-none pointer-events-none -rotate-6">
          中
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Based on Peking University Curriculum
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            Learn
            <span className="text-red-600"> Chinese </span>
            Beautifully
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            A thoughtfully designed course that takes you from zero to 150 words.
            Each lesson weaves language, culture, and real travel stories into one smooth experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 h-12 rounded-xl shadow-lg shadow-red-200 dark:shadow-red-900/30">
                Start Learning <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/lessons">
              <Button variant="outline" size="lg" className="text-base px-8 h-12 rounded-xl">
                Browse Lessons
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-12 mt-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">9</p>
              <p className="text-sm text-muted-foreground">Lessons</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">150+</p>
              <p className="text-sm text-muted-foreground">Words</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">15</p>
              <p className="text-sm text-muted-foreground">Grammar Points</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">🔊</p>
              <p className="text-sm text-muted-foreground">Pronunciation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Your Learning Journey</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Nine lessons — each set in a different Chinese city. Learn language through the food, history, and people you&apos;d meet there.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <Link
              key={lesson.num}
              href="/lessons"
              className="group relative bg-card rounded-2xl border p-5 hover:shadow-lg hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 overflow-hidden"
            >
              {/* Color accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${lesson.color} rounded-t-2xl`} />
              {/* Lesson number badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Lesson {lesson.num}
                </span>
                <span className="text-3xl font-bold text-red-600/10 dark:text-red-400/20 group-hover:text-red-600/20 transition-colors">
                  {lesson.cn}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-1">{lesson.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{lesson.desc}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {lesson.words} words
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 dark:bg-zinc-900/50 py-20">
        <div className="max-w-4xl mx-auto px-4 grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Contextual Learning</h3>
            <p className="text-sm text-muted-foreground">
              Every word comes with a real travel sentence. Learn &ldquo;spicy&rdquo; while ordering hotpot in Chengdu.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Smart Review</h3>
            <p className="text-sm text-muted-foreground">
              Spaced repetition built in. Words you struggle with appear more often until they stick.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Pronunciation First</h3>
            <p className="text-sm text-muted-foreground">
              Click any word to hear it spoken. A full pinyin guide teaches you all four tones.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
        <p className="text-muted-foreground mb-8">
          Join now and learn your first Chinese words in under 5 minutes.
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-10 h-14 rounded-2xl shadow-xl shadow-red-200 dark:shadow-red-900/30">
            Begin Your Journey <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Built with Next.js · NestJS · GraphQL · Supabase
      </footer>
    </div>
  );
}
