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

  // ====== HIDE NAVBAR IN LESSONS ======
  if (isInLesson) return null;

  // ====== FULL NAVBAR (all other pages) ======
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 dark:bg-zinc-950/80">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <GraduationCap className="w-6 h-6 text-red-600" />
          <span>Learn Chinese</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/courses">
                <Button variant="ghost" size="sm">
                  <BookOpen className="w-4 h-4 mr-1" /> Courses
                </Button>
              </Link>
              <Link href="/vocabulary">
                <Button variant="ghost" size="sm">
                  <Library className="w-4 h-4 mr-1" /> Vocab
                </Button>
              </Link>
              <Link href="/grammar">
                <Button variant="ghost" size="sm">
                  <Languages className="w-4 h-4 mr-1" /> Grammar
                </Button>
              </Link>
              <Link href="/flashcards">
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4 mr-1" /> Flashcards
                </Button>
              </Link>
              <Link href="/pinyin">
                <Button variant="ghost" size="sm">
                  <AudioLines className="w-4 h-4 mr-1" /> Pinyin
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
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
