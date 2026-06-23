import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Sparkles, BookOpen, Trophy, Compass, Map, Languages } from 'lucide-react';

const lessons = [
  { num: 1, name: 'Beijing', cn: '北京', desc: 'Greetings, introductions & numbers', words: 28, color: 'from-rose-500 to-red-600', shadow: 'shadow-red-500/10' },
  { num: 2, name: 'Shaanxi', cn: '陕西', desc: 'Telling time, dates & questions', words: 20, color: 'from-orange-500 to-amber-600', shadow: 'shadow-orange-500/10' },
  { num: 3, name: 'Sichuan', cn: '四川', desc: 'Food, ordering & adjectives', words: 20, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/10' },
  { num: 4, name: 'Shanghai', cn: '上海', desc: 'Shopping, money & measure words', words: 17, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/10' },
  { num: 5, name: 'Yunnan', cn: '云南', desc: 'Weather, nature & locations', words: 16, color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/10' },
  { num: 6, name: 'Guangdong', cn: '广东', desc: 'Family, work & abilities', words: 17, color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/10' },
  { num: 7, name: 'Henan', cn: '河南', desc: 'Actions, sports & abilities', words: 13, color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/10' },
  { num: 8, name: 'Xinjiang', cn: '新疆', desc: 'Travel, directions & transport', words: 15, color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/10' },
  { num: 9, name: 'Hong Kong', cn: '香港', desc: 'Review & real-world practice', words: 13, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/10' },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative characters background */}
      <div className="absolute top-24 right-10 md:right-20 text-[180px] md:text-[240px] font-extrabold text-red-500/[0.04] dark:text-red-400/[0.03] select-none pointer-events-none rotate-12 transition-transform duration-1000 cn-display">
        学
      </div>
      <div className="absolute bottom-40 left-10 md:left-24 text-[120px] md:text-[180px] font-extrabold text-amber-500/[0.03] dark:text-amber-400/[0.02] select-none pointer-events-none -rotate-12 transition-transform duration-1000 cn-display">
        中
      </div>

      {/* Hero section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-red-500" /> Based on Peking University Curriculum
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Learn Chinese <br />
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 bg-clip-text text-transparent select-all">
              Beautifully
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-light">
            A travel-themed HSK 1 course that takes you from zero to 150 words.
            Each lesson weaves vocabulary, grammar, and stroke orders into a rich story across China.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 h-13 rounded-2xl shadow-lg shadow-red-500/20 btn-premium bg-primary text-primary-foreground hover:bg-primary/90">
                Start Learning <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/lessons">
              <Button variant="outline" size="lg" className="text-base px-8 h-13 rounded-2xl glass-card hover:bg-muted/50 border-border/80">
                Browse Lessons
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-20">
            <div className="p-5 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-3 text-red-600 dark:text-red-400">
                <Map className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold tracking-tight">9</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mt-1">Provinces</p>
            </div>
            <div className="p-5 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3 text-amber-600 dark:text-amber-400">
                <Languages className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold tracking-tight">150+</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mt-1">Vocab Words</p>
            </div>
            <div className="p-5 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 text-emerald-600 dark:text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold tracking-tight">15</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mt-1">Grammar Points</p>
            </div>
            <div className="p-5 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400">
                <Trophy className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold tracking-tight">9</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mt-1">Travel Rewards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course overview */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Your Journey Across China</h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-light">
            Nine immersive chapters — each set in a distinct city. Learn language and culture naturally through local food, geography, and real-world conversation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Link
              key={lesson.num}
              href="/lessons"
              className={`group relative bg-card rounded-3xl border p-6 card-hover shadow-sm ${lesson.shadow} overflow-hidden`}
            >
              {/* Top Accent Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${lesson.color}`} />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Lesson {lesson.num}
                </span>
                <span className="text-3xl font-bold text-red-500/10 dark:text-red-400/10 group-hover:text-red-500/20 group-hover:scale-110 transition-all duration-300 cn-display">
                  {lesson.cn}
                </span>
              </div>
              
              <h3 className="font-bold text-xl mb-2 group-hover:text-red-600 transition-colors">{lesson.name}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{lesson.desc}</p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground border-t pt-4">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-red-500/70" /> {lesson.words} HSK Words
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gradient-to-b from-card/30 to-card/60 border-y py-20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-10">
          <div className="text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4 md:mx-0 mx-auto text-red-600 dark:text-red-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Contextual Travel Story</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every word comes with a real-life situation. Learn &ldquo;spicy&rdquo; while ordering hotpot in Chengdu or &ldquo;tea&rdquo; in Yunnan.
            </p>
          </div>
          <div className="text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4 md:mx-0 mx-auto text-amber-600 dark:text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Adaptive Mastery Levels</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mastery tracking built-in. Tap to hear native pronunciation, view stroke order diagrams, and save words for customized flashcard review.
            </p>
          </div>
          <div className="text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 md:mx-0 mx-auto text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Interactive Exercises</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Test your understanding immediately. Solve listening, writing, and word arrangement puzzles after studying the vocabulary.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-extrabold mb-4">Start Your Chinese Journey</h2>
        <p className="text-muted-foreground mb-8 text-lg font-light max-w-md mx-auto">
          Create an account and learn your first Chinese words and cultural secrets in just 5 minutes.
        </p>
        <Link href="/register">
          <Button size="lg" className="text-base px-10 h-14 rounded-2xl shadow-xl shadow-red-500/20 btn-premium bg-primary text-primary-foreground hover:bg-primary/90">
            Begin Journey <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </section>

      <footer className="border-t py-10 text-center text-xs text-muted-foreground bg-card/10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-foreground">Learn Chinese</span> · HSK 1 Curriculum
          </div>
          <div className="flex gap-2">
            Built with Next.js · GraphQL · NestJS · Supabase
          </div>
        </div>
      </footer>
    </div>
  );
}

