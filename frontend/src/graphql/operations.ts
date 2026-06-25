// GraphQL operations for the redesigned frontend.
// Run `npm run codegen` to regenerate typed documents in `src/graphql/__generated__`.
//
// Operations here are the single source of truth for queries/mutations the
// React pages use. Pages import the typed `gql` from the codegen preset.
import { gql } from '@apollo/client';

// ============================================================
// Auth / User
// ============================================================

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      email
      name
      createdAt
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      email
      name
      createdAt
    }
  }
`;

// ============================================================
// Courses & Provinces (lessons)
// ============================================================

export const COURSES = gql`
  query Courses {
    courses {
      id
      name
      description
      level
      imageUrl
      lessonCount
      provinces {
        id
        name
        capital
        unlockOrder
        color
        imageUrl
      }
    }
  }
`;

export const COURSE = gql`
  query Course($id: ID!) {
    course(id: $id) {
      id
      name
      description
      level
      provinces {
        id
        name
        capital
        unlockOrder
        color
        imageUrl
      }
    }
  }
`;

export const PROVINCES = gql`
  query Provinces {
    provinces {
      id
      name
      capital
      unlockOrder
      color
      imageUrl
    }
  }
`;

export const PROVINCE = gql`
  query Province($id: ID!) {
    province(id: $id) {
      id
      name
      capital
      culturalDescription
      landmark
      landmarkFact
      food
      foodDescription
      custom
      unlockOrder
      color
      imageUrl
      storyContent
      vocabulary {
        id
        character
        pinyin
        english
        category
        travelSentence
      }
      grammar {
        id
        title
        explanation
        examples
      }
      exercises {
        id
        type
        question
        questionLabel
        options
        correctAnswer
      }
    }
  }
`;

export const NEXT_PROVINCE = gql`
  query NextProvince {
    nextProvince {
      id
      name
      capital
      unlockOrder
      color
    }
  }
`;

export const IS_PROVINCE_UNLOCKED = gql`
  query IsProvinceUnlocked($provinceId: ID!) {
    isProvinceUnlocked(provinceId: $provinceId)
  }
`;

// ============================================================
// Vocabulary
// ============================================================

export const VOCABULARY = gql`
  query Vocabulary($provinceId: ID) {
    vocabulary(provinceId: $provinceId) {
      id
      character
      pinyin
      english
      category
      travelSentence
      masteryLevel
      srsState
      isDue
      isSaved
      province {
        name
        color
      }
    }
  }
`;

export const WORD = gql`
  query Word($id: ID!) {
    word(id: $id) {
      id
      character
      pinyin
      english
      category
      travelSentence
      masteryLevel
      srsState
      isDue
      isSaved
      province {
        name
        color
      }
    }
  }
`;

// ============================================================
// Progress (legacy)
// ============================================================

export const USER_PROGRESS = gql`
  query UserProgress {
    userProgress {
      provinceId
      completed
      score
      exercisesDone
      lastStudiedAt
    }
    wordProgress {
      wordId
      state
      masteryLevel
      reps
      lapses
      lastReviewedAt
      nextReviewAt
    }
  }
`;

// ============================================================
// SRS / Practice (new)
// ============================================================

export const DUE_CARDS = gql`
  query DueCards($limit: Int, $mode: ReviewMode, $provinceId: ID) {
    dueCards(limit: $limit, mode: $mode, provinceId: $provinceId) {
      wordId
      character
      pinyin
      english
      category
      travelSentence
      masteryLevel
      state
    }
  }
`;

export const REVIEW_STATS = gql`
  query ReviewStats {
    reviewStats {
      cardsDue
      newCardsToday
      reviewedToday
      retentionPct
      streak
      longestStreak
    }
  }
`;

export const START_REVIEW_SESSION = gql`
  mutation StartReviewSession($input: StartReviewSessionInput!) {
    startReviewSession(input: $input) {
      id
      mode
      cards {
        wordId
        character
        pinyin
        english
        category
        travelSentence
        masteryLevel
        state
      }
      totalCards
    }
  }
`;

export const RECORD_REVIEW = gql`
  mutation RecordReview($input: RecordReviewInput!) {
    recordReview(input: $input) {
      wordId
      masteryLevel
      state
      nextReviewAt
      sessionReviewed
      sessionCorrect
    }
  }
`;

// ============================================================
// Exercises (graded by strategy)
// ============================================================

export const EXERCISES = gql`
  query Exercises($provinceId: ID!) {
    exercises(provinceId: $provinceId) {
      id
      type
      question
      questionLabel
      options
      correctAnswer
    }
  }
`;

export const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer($input: SubmitAnswerInput!) {
    submitAnswer(input: $input) {
      correct
      exerciseId
      correctAnswer
      partialCredit
      score
      exercisesDone
    }
  }
`;

// ============================================================
// Flashcards / saved words
// ============================================================

export const SAVED_WORDS = gql`
  query SavedWords {
    savedWords {
      id
      createdAt
      word {
        id
        character
        pinyin
        english
        category
        travelSentence
      }
    }
  }
`;

export const IS_WORD_SAVED = gql`
  query IsWordSaved($wordId: ID!) {
    isWordSaved(wordId: $wordId)
  }
`;

export const SAVE_WORD = gql`
  mutation SaveWord($input: WordIdInput!) {
    saveWord(input: $input) {
      id
      createdAt
      word {
        id
        character
        pinyin
        english
        category
      }
    }
  }
`;

export const UNSAVE_WORD = gql`
  mutation UnsaveWord($input: WordIdInput!) {
    unsaveWord(input: $input)
  }
`;

export const COMPLETE_PROVINCE = gql`
  mutation CompleteProvince($input: ProvinceIdInput!) {
    completeProvince(input: $input) {
      id
      completed
    }
  }
`;