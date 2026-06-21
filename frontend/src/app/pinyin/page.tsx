'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PronounceButton } from '@/components/pronounce-button';
import Link from 'next/link';

const tones = [
  {
    name: 'First Tone (Flat)',
    mark: '¯',
    number: '1',
    description: 'High and level. Keep your voice steady and high, like singing a note.',
    example: '妈 (mā)',
    pronounceText: '妈',
    meaning: 'mother',
    color: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    name: 'Second Tone (Rising)',
    mark: 'ˊ',
    number: '2',
    description: 'Starts mid and rises sharply, like asking a question in English: "Huh?"',
    example: '麻 (má)',
    pronounceText: '麻',
    meaning: 'hemp',
    color: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    name: 'Third Tone (Dip)',
    mark: 'ˇ',
    number: '3',
    description: 'Dips low then rises. Your voice goes down then back up. The trickiest tone!',
    example: '马 (mǎ)',
    pronounceText: '马',
    meaning: 'horse',
    color: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    name: 'Fourth Tone (Falling)',
    mark: 'ˋ',
    number: '4',
    description: 'Falls sharply from high to low, like saying "No!" emphatically.',
    example: '骂 (mà)',
    pronounceText: '骂',
    meaning: 'to scold',
    color: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    name: 'Neutral Tone',
    mark: '·',
    number: '5',
    description: 'Light and short, no tone mark. Said quickly without emphasis.',
    example: '吗 (ma)',
    pronounceText: '吗',
    meaning: 'question particle',
    color: 'bg-gray-100 dark:bg-gray-800',
  },
];

const pinyinInitials = [
  { sound: 'b', group: 'Labial', example: '爸 (bà)', pronounceText: '爸', tip: 'Lips together, then release with a puff of air. Like English b but softer.' },
  { sound: 'p', group: 'Labial', example: '怕 (pà)', pronounceText: '怕', tip: 'Lips together, strong puff of air on release. Like English p with more air.' },
  { sound: 'm', group: 'Labial', example: '妈 (mā)', pronounceText: '妈', tip: 'Lips together, hum through nose. Same as English m.' },
  { sound: 'f', group: 'Labial', example: '发 (fā)', pronounceText: '发', tip: 'Top teeth on bottom lip, blow air through. Same as English f.' },
  { sound: 'd', group: 'Alveolar', example: '大 (dà)', pronounceText: '大', tip: 'Tongue tip touches the ridge behind upper teeth. Like English d but softer.' },
  { sound: 't', group: 'Alveolar', example: '他 (tā)', pronounceText: '他', tip: 'Tongue tip on upper ridge, strong puff of air. Like English t with more air.' },
  { sound: 'n', group: 'Alveolar', example: '你 (nǐ)', pronounceText: '你', tip: 'Tongue tip on upper ridge, air through nose. Same as English n.' },
  { sound: 'l', group: 'Alveolar', example: '来 (lái)', pronounceText: '来', tip: 'Tongue tip on upper ridge, air flows around sides of tongue. Like English l.' },
  { sound: 'g', group: 'Velar', example: '个 (gè)', pronounceText: '个', tip: 'Back of tongue touches soft palate. Like English g in "go" but softer.' },
  { sound: 'k', group: 'Velar', example: '看 (kàn)', pronounceText: '看', tip: 'Back of tongue on soft palate, strong puff of air. Like English k with more air.' },
  { sound: 'h', group: 'Velar', example: '好 (hǎo)', pronounceText: '好', tip: 'Back of tongue near soft palate, raspy friction. Rougher than English h — like Scottish "loch".' },
  { sound: 'j', group: 'Palatal', example: '家 (jiā)', pronounceText: '家', tip: 'Tongue body pressed against hard palate (roof of mouth). Like English j but with tongue higher. Smile slightly.' },
  { sound: 'q', group: 'Palatal', example: '七 (qī)', pronounceText: '七', tip: 'Same tongue position as j, but with a strong puff of air. Like "chee" in "cheese" with tongue flat against palate.' },
  { sound: 'x', group: 'Palatal', example: '小 (xiǎo)', pronounceText: '小', tip: 'Same tongue position as j/q, but air flows continuously. Like English sh but with tongue body raised. Smile and hiss.' },
  { sound: 'zh', group: 'Retroflex', example: '这 (zhè)', pronounceText: '这', tip: 'Curl tongue tip back (not touching roof). Like English j but with tongue curled back. This is the hardest group!' },
  { sound: 'ch', group: 'Retroflex', example: '吃 (chī)', pronounceText: '吃', tip: 'Same curled tongue as zh, but with strong puff of air. Like "chur" with tongue curled back.' },
  { sound: 'sh', group: 'Retroflex', example: '是 (shì)', pronounceText: '是', tip: 'Same curled tongue position. Like English sh but with tongue curled further back. Think "shh" with tongue tip pointing up.' },
  { sound: 'r', group: 'Retroflex', example: '人 (rén)', pronounceText: '人', tip: 'Same curled tongue as sh, but add voice. Like a blend of English r and the "s" in "pleasure". No English equivalent.' },
  { sound: 'z', group: 'Dental', example: '在 (zài)', pronounceText: '在', tip: 'Tongue tip touches back of front teeth. Like English "ds" in "beds" but as one sound.' },
  { sound: 'c', group: 'Dental', example: '次 (cì)', pronounceText: '次', tip: 'Same dental position as z, but with strong puff of air. Like "ts" in "cats" with more air.' },
  { sound: 's', group: 'Dental', example: '三 (sān)', pronounceText: '三', tip: 'Tongue tip near back of teeth, continuous hiss. Like English s but with tongue further forward against teeth.' },
];

const finals = [
  { sound: 'a', group: 'Simple', example: '妈 (mā)', pronounceText: '妈', tip: 'Mouth wide open, tongue low and flat. Like "ah" at the doctor. The most open vowel.' },
  { sound: 'o', group: 'Simple', example: '我 (wǒ)', pronounceText: '我', tip: 'Lips rounded and slightly protruding. Tongue mid-high and back. Like English "aw" but rounder.' },
  { sound: 'e', group: 'Simple', example: '这 (zhè)', pronounceText: '这', tip: 'Tongue mid-high, back, lips unrounded. Like the "u" in "duh" but no English equivalent. Keep tongue back.' },
  { sound: 'i', group: 'Simple', example: '一 (yī)', pronounceText: '一', tip: 'Tongue high and front, lips spread like a smile. Like English "ee" in "see" but tenser.' },
  { sound: 'u', group: 'Simple', example: '五 (wǔ)', pronounceText: '五', tip: 'Lips tightly rounded and pushed forward. Tongue high and back. Like English "oo" in "boo" but with more lip rounding.' },
  { sound: 'ü', group: 'Simple', example: '女 (nǚ)', pronounceText: '女', tip: 'Say "ee" (i), then round your lips while keeping the tongue in the "ee" position. Like French "u" or German "ü".' },
  { sound: 'ai', group: 'Compound', example: '爱 (ài)', pronounceText: '爱', tip: 'Start at a (open), glide to i (high front). Like English "eye" but shorter.' },
  { sound: 'ei', group: 'Compound', example: '北 (běi)', pronounceText: '北', tip: 'Start at e (mid back), glide to i (high front). Like English "ay" in "day" but shorter.' },
  { sound: 'ao', group: 'Compound', example: '好 (hǎo)', pronounceText: '好', tip: 'Start at a (open), glide to o (rounded back). Like English "ow" in "how" but the ending is rounder.' },
  { sound: 'ou', group: 'Compound', example: '走 (zǒu)', pronounceText: '走', tip: 'Start at o (mid back, rounded), glide to u (high back). Like English "oh" with more lip rounding at the end.' },
  { sound: 'an', group: 'Nasal', example: '看 (kàn)', pronounceText: '看', tip: 'a + n. Tongue tip touches upper ridge for the n. Air through nose at the end.' },
  { sound: 'en', group: 'Nasal', example: '人 (rén)', pronounceText: '人', tip: 'e + n. Tongue mid-back then tip touches ridge. Like English "un" in "under".' },
  { sound: 'ang', group: 'Nasal', example: '上 (shàng)', pronounceText: '上', tip: 'a + ng. Back of tongue touches soft palate, air through nose. Like English "ahng". Mouth more open than English.' },
  { sound: 'eng', group: 'Nasal', example: '冷 (lěng)', pronounceText: '冷', tip: 'e + ng. Like English "ung" in "lung" but starting with e. Back of tongue to soft palate.' },
  { sound: 'ong', group: 'Nasal', example: '中 (zhōng)', pronounceText: '中', tip: 'o + ng. Lips rounded, tongue back, then ng. Like English "oong" with rounded lips throughout.' },
  { sound: 'ia', group: 'Glide', example: '家 (jiā)', pronounceText: '家', tip: 'i + a. Quick i (like y), then open to a. Like "ya" in "yard".' },
  { sound: 'ie', group: 'Glide', example: '写 (xiě)', pronounceText: '写', tip: 'i + e. Quick i, then open to e. Like "ye" in "yes" but ending with e position.' },
  { sound: 'ua', group: 'Glide', example: '花 (huā)', pronounceText: '花', tip: 'u + a. Quick rounded u (like w), then open to a. Like "wa" in "water".' },
  { sound: 'uo', group: 'Glide', example: '我 (wǒ)', pronounceText: '我', tip: 'u + o. Quick rounded u, then to o. Like "wo" in "wore" with rounder lips.' },
  { sound: 'üe', group: 'Glide', example: '月 (yuè)', pronounceText: '月', tip: 'ü + e. Start with ü (ee with rounded lips), glide to e. Like "yweh". Tricky — practice slowly!' },
  { sound: 'iao', group: 'Triphthong', example: '小 (xiǎo)', pronounceText: '小', tip: 'i + a + o. Quick i, open to a, round to o. Like "yow" in "yowl". Three vowel positions in one syllable!' },
  { sound: 'iu', group: 'Triphthong', example: '六 (liù)', pronounceText: '六', tip: 'i + o + u. Quick i, mid o, to u. Like "yo" with rounded ending. Actually i+ou compressed.' },
  { sound: 'uai', group: 'Triphthong', example: '快 (kuài)', pronounceText: '快', tip: 'u + a + i. Rounded u, open a, front i. Like English "why" with more lip rounding at the start.' },
  { sound: 'ui', group: 'Triphthong', example: '对 (duì)', pronounceText: '对', tip: 'u + e + i. Rounded u, mid e, front i. Like "way" but starting with rounded lips. Actually u+ei compressed.' },
  { sound: 'ian', group: 'Nasal+Glide', example: '天 (tiān)', pronounceText: '天', tip: 'i + e + n. Quick i, open to e-ish, end with n. Like "yen" but the middle vowel is more open.' },
  { sound: 'uan', group: 'Nasal+Glide', example: '万 (wàn)', pronounceText: '万', tip: 'u + a + n. Rounded start, open middle, n end. Like "wahn" in "wand".' },
  { sound: 'iang', group: 'Nasal+Glide', example: '两 (liǎng)', pronounceText: '两', tip: 'i + a + ng. Quick i, open a, back ng. Like "yahng". Let the ng resonate in your nose.' },
  { sound: 'uang', group: 'Nasal+Glide', example: '王 (wáng)', pronounceText: '王', tip: 'u + a + ng. Rounded start, open middle, ng end. Like "wahng". Keep lips rounded at the start.' },
];

export default function PinyinGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Pinyin Pronunciation Guide</h1>
      <p className="text-muted-foreground mb-8">
        Pinyin is the romanization system for Chinese. Master these sounds and you can read any
        Chinese word aloud.
      </p>

      {/* The 5 Tones */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">The Five Tones</h2>
        <p className="text-muted-foreground mb-4">
          Chinese is a tonal language — the tone you use changes the meaning completely.
          mā (mother) ≠ mǎ (horse) ≠ mà (to scold)!
        </p>

        <div className="space-y-3">
          {tones.map((tone) => (
            <Card key={tone.name} className={`p-5 ${tone.color}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>Tone {tone.number}</Badge>
                    <h3 className="font-semibold">{tone.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{tone.description}</p>
                  <p className="text-lg font-medium">
                    {tone.example} — {tone.meaning}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tone mark: <code className="bg-muted px-1 rounded">{tone.mark}</code>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <PronounceButton text={tone.pronounceText} size="md" />
                  <span className="text-xs text-muted-foreground">Listen</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Initials */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Initials (Consonants)</h2>
        <p className="text-muted-foreground mb-4">
          The beginning sound of a syllable. Click 🔊 to hear each one. Pay attention to j/q/x and zh/ch/sh — they have no English equivalent.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pinyinInitials.map((init) => (
            <Link key={init.sound} href={`/pinyin/${init.sound}`}>
            <Card className="p-5 hover:border-red-200 transition-all hover:shadow-sm rounded-2xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer">
              <div className="text-center mb-3">
                <p className="text-4xl font-bold text-red-600 dark:text-red-400">{init.sound}</p>
                <p className="text-xs text-muted-foreground mt-1">{init.group}</p>
              </div>
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">e.g. {init.example}</span>
                  <PronounceButton text={init.pronounceText} size="sm" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">{init.tip}</p>
            </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Finals */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Finals (Vowels & Endings)</h2>
        <p className="text-muted-foreground mb-4">
          The ending part of a syllable. Click 🔊 to hear the example word spoken.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {finals.map((f) => (
            <Link key={f.sound} href={`/pinyin/${f.sound}`}>
            <Card className="p-5 hover:border-blue-200 transition-all hover:shadow-sm rounded-2xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer">
              <div className="text-center mb-3">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{f.sound}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.group}</p>
              </div>
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">e.g. {f.example}</span>
                  <PronounceButton text={f.pronounceText} size="sm" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">{f.tip}</p>
            </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Quick Tips</h2>
        <Card className="p-5 space-y-3">
          <div>
            <h3 className="font-semibold">🗣️ Tone changes (sandhi)</h3>
            <p className="text-sm text-muted-foreground">
              When two 3rd tones appear together, the first one becomes 2nd tone. Example: 你好
              (nǐ hǎo → ní hǎo).
            </p>
          </div>
          <div>
            <h3 className="font-semibold">📏 Tone mark placement</h3>
            <p className="text-sm text-muted-foreground">
              The tone mark goes on the main vowel. Rule: &ldquo;a, o, e&rdquo; takes priority, then
              &ldquo;i, u, ü&rdquo;. If &ldquo;i&rdquo; and &ldquo;u&rdquo; are together, the tone
              mark goes on the second one.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">🎯 Practice daily</h3>
            <p className="text-sm text-muted-foreground">
              Listen to the audio for every vocabulary word as you learn. Imitate native speakers.
              Record yourself and compare!
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
