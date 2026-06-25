// Canonical domain types for the frontend.
// These mirror the GraphQL types but are hand-written for sources where we shape
// the data slightly (due cards, exercise items, etc.) and where the codegen types
// would force every page to depend on `__typename`.

export type CourseLevel = 'HSK1' | 'HSK2' | 'HSK3';

export type ExerciseType =
  | 'MULTIPLE_CHOICE'
  | 'RECALL_MEANING'
  | 'RECALL_READING'
  | 'LISTENING'
  | 'TONE'
  | 'WRITING'
  | 'FILL_BLANK'
  | 'MATCHING'
  | 'CULTURAL';

export type CardState = 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING' | 'GRADUATED';

export type ReviewRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export type ReviewMode = 'DAILY' | 'SAVED_ONLY' | 'LESSON_PRE' | 'LESSON_POST';

export interface WordProvince {
  name: string;
  color: string;
}

export interface Word {
  id: string;
  character: string;
  pinyin: string;
  english: string;
  category: string;
  travelSentence?: string | null;
  masteryLevel?: number | null;
  srsState?: CardState | null;
  isDue?: boolean | null;
  isSaved?: boolean | null;
  province?: WordProvince | null;
}

export interface DueCard {
  wordId: string;
  character: string;
  pinyin: string;
  english: string;
  category: string;
  travelSentence?: string | null;
  masteryLevel: number;
  state: CardState;
}

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  question: string;
  questionLabel?: string | null;
  options: string; // JSON-encoded array
  correctAnswer: string;
}

export interface ReviewStats {
  cardsDue: number;
  newCardsToday: number;
  reviewedToday: number;
  retentionPct: number;
  streak: number;
  longestStreak: number;
}

export interface ReviewSession {
  id: string;
  mode: ReviewMode;
  cards: DueCard[];
  totalCards: number;
}

export interface ReviewResult {
  wordId: string;
  masteryLevel: number;
  state: CardState;
  nextReviewAt: string;
  sessionReviewed: number;
  sessionCorrect: number;
}

export interface ExerciseResult {
  correct: boolean;
  exerciseId: string;
  correctAnswer: string;
  partialCredit: number;
  score: number;
  exercisesDone: number;
}

export interface UserProgress {
  provinceId: string;
  completed: boolean;
  score: number;
  exercisesDone: number;
  lastStudiedAt: string;
}

export interface Province {
  id: string;
  name: string;
  capital: string;
  culturalDescription: string;
  landmark: string;
  landmarkFact: string;
  food: string;
  foodDescription: string;
  custom: string;
  unlockOrder: number;
  color: string;
  imageUrl?: string | null;
  storyContent?: string | null;
  vocabulary?: Word[];
  grammar?: GrammarPoint[];
  exercises?: ExerciseItem[];
}

export interface GrammarPoint {
  id: string;
  title: string;
  explanation: string;
  examples: string; // JSON array of GrammarExample
}

export interface GrammarExample {
  chinese: string;
  pinyin: string;
  english: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  level: CourseLevel;
  imageUrl?: string | null;
  lessonCount?: number | null;
  provinces?: Province[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}