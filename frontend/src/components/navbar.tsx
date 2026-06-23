'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { BookOpen, GraduationCap, LogOut, Menu, X, Library, Languages, AudioLines, Bookmark } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isInLesson = pathname?.startsWith('/lessons/') && pathname !== '/lessons';

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  // ====== HIDE NAVBAR IN LESSONS ======
  if (isInLesson) return null;

  // ====== FULL NAVBAR (all other pages) ======
  return (
    <nav className="border-b border-border/60 bg-white/70 backdrop-blur-md sticky top-0 z-50 dark:bg-zinc-950/70 shadow-sm shadow-red-950/[0.01]">
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-primary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-heading">Learn Chinese</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant={isActive('/dashboard') ? 'secondary' : 'ghost'} size="sm" className="rounded-xl font-medium">Dashboard</Button>
              </Link>
              <Link href="/courses">
                <Button variant={isActive('/courses') ? 'secondary' : 'ghost'} size="sm" className="rounded-xl font-medium">
                  <BookOpen className="w-4 h-4 mr-1.5 text-primary" /> Courses
                </Button>
              </Link>
              <Link href="/vocabulary">
                <Button variant={isActive('/vocabulary') ? 'secondary' : 'ghost'} size="sm" className="rounded-xl font-medium">
                  <Library className="w-4 h-4 mr-1.5 text-amber-500" /> Vocab
                </Button>
              </Link>
              <Link href="/grammar">
                <Button variant={isActive('/grammar') ? 'secondary' : 'ghost'} size="sm" className="rounded-xl font-medium">
                  <Languages className="w-4 h-4 mr-1.5 text-emerald-500" /> Grammar
                </Button>
              </Link>
              <Link href="/flashcards">
                <Button variant={isActive('/flashcards') ? 'secondary' : 'ghost'} size="sm" className="rounded-xl font-medium">
                  <Bookmark className="w-4 h-4 mr-1.5 text-rose-500" /> Flashcards
                </Button>
              </Link>
              <Link href="/pinyin">
                <Button variant={isActive('/pinyin') ? 'secondary' : 'ghost'} size="sm" className="rounded-xl font-medium">
                  <AudioLines className="w-4 h-4 mr-1.5 text-blue-500" /> Pinyin
                </Button>
              </Link>
              <div className="w-px h-5 bg-border mx-1" />
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-950 dark:hover:bg-red-950/20">
                <LogOut className="w-4 h-4 mr-1.5" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-xl">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-xl btn-premium bg-primary text-primary-foreground">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-2 bg-white dark:bg-zinc-950">
          {user ? (
            <>
              <Link href="/dashboard" className="block py-1" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/courses" className="block py-1" onClick={() => setMenuOpen(false)}>Courses</Link>
              <Link href="/vocabulary" className="block py-1" onClick={() => setMenuOpen(false)}>Vocabulary</Link>
              <Link href="/grammar" className="block py-1" onClick={() => setMenuOpen(false)}>Grammar</Link>
              <Link href="/flashcards" className="block py-1" onClick={() => setMenuOpen(false)}>Flashcards</Link>
              <Link href="/pinyin" className="block py-1" onClick={() => setMenuOpen(false)}>Pinyin Guide</Link>
              <button onClick={handleLogout} className="block py-1 text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-1" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="block py-1" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
