/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query CurrentUser {\n    currentUser {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n": typeof types.CurrentUserDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n": typeof types.MeDocument,
    "\n  query Courses {\n    courses {\n      id\n      name\n      description\n      level\n      imageUrl\n      lessonCount\n      provinces {\n        id\n        name\n        capital\n        unlockOrder\n        color\n        imageUrl\n      }\n    }\n  }\n": typeof types.CoursesDocument,
    "\n  query Course($id: ID!) {\n    course(id: $id) {\n      id\n      name\n      description\n      level\n      provinces {\n        id\n        name\n        capital\n        unlockOrder\n        color\n        imageUrl\n      }\n    }\n  }\n": typeof types.CourseDocument,
    "\n  query Provinces {\n    provinces {\n      id\n      name\n      capital\n      unlockOrder\n      color\n      imageUrl\n    }\n  }\n": typeof types.ProvincesDocument,
    "\n  query Province($id: ID!) {\n    province(id: $id) {\n      id\n      name\n      capital\n      culturalDescription\n      landmark\n      landmarkFact\n      food\n      foodDescription\n      custom\n      unlockOrder\n      color\n      imageUrl\n      storyContent\n      vocabulary {\n        id\n        character\n        pinyin\n        english\n        category\n        travelSentence\n      }\n      grammar {\n        id\n        title\n        explanation\n        examples\n      }\n      exercises {\n        id\n        type\n        question\n        questionLabel\n        options\n        correctAnswer\n      }\n    }\n  }\n": typeof types.ProvinceDocument,
    "\n  query NextProvince {\n    nextProvince {\n      id\n      name\n      capital\n      unlockOrder\n      color\n    }\n  }\n": typeof types.NextProvinceDocument,
    "\n  query IsProvinceUnlocked($provinceId: ID!) {\n    isProvinceUnlocked(provinceId: $provinceId)\n  }\n": typeof types.IsProvinceUnlockedDocument,
    "\n  query Vocabulary($provinceId: ID) {\n    vocabulary(provinceId: $provinceId) {\n      id\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      srsState\n      isDue\n      isSaved\n      province {\n        name\n        color\n      }\n    }\n  }\n": typeof types.VocabularyDocument,
    "\n  query Word($id: ID!) {\n    word(id: $id) {\n      id\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      srsState\n      isDue\n      isSaved\n      province {\n        name\n        color\n      }\n    }\n  }\n": typeof types.WordDocument,
    "\n  query UserProgress {\n    userProgress {\n      provinceId\n      completed\n      score\n      exercisesDone\n      lastStudiedAt\n    }\n    wordProgress {\n      wordId\n      state\n      masteryLevel\n      reps\n      lapses\n      lastReviewedAt\n      nextReviewAt\n    }\n  }\n": typeof types.UserProgressDocument,
    "\n  query DueCards($limit: Int, $mode: ReviewMode, $provinceId: ID) {\n    dueCards(limit: $limit, mode: $mode, provinceId: $provinceId) {\n      wordId\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      state\n    }\n  }\n": typeof types.DueCardsDocument,
    "\n  query ReviewStats {\n    reviewStats {\n      cardsDue\n      newCardsToday\n      reviewedToday\n      retentionPct\n      streak\n      longestStreak\n    }\n  }\n": typeof types.ReviewStatsDocument,
    "\n  mutation StartReviewSession($input: StartReviewSessionInput!) {\n    startReviewSession(input: $input) {\n      id\n      mode\n      cards {\n        wordId\n        character\n        pinyin\n        english\n        category\n        travelSentence\n        masteryLevel\n        state\n      }\n      totalCards\n    }\n  }\n": typeof types.StartReviewSessionDocument,
    "\n  mutation RecordReview($input: RecordReviewInput!) {\n    recordReview(input: $input) {\n      wordId\n      masteryLevel\n      state\n      nextReviewAt\n      sessionReviewed\n      sessionCorrect\n    }\n  }\n": typeof types.RecordReviewDocument,
    "\n  query Exercises($provinceId: ID!) {\n    exercises(provinceId: $provinceId) {\n      id\n      type\n      question\n      questionLabel\n      options\n      correctAnswer\n    }\n  }\n": typeof types.ExercisesDocument,
    "\n  mutation SubmitAnswer($input: SubmitAnswerInput!) {\n    submitAnswer(input: $input) {\n      correct\n      exerciseId\n      correctAnswer\n      partialCredit\n      score\n      exercisesDone\n    }\n  }\n": typeof types.SubmitAnswerDocument,
    "\n  query SavedWords {\n    savedWords {\n      id\n      createdAt\n      word {\n        id\n        character\n        pinyin\n        english\n        category\n        travelSentence\n      }\n    }\n  }\n": typeof types.SavedWordsDocument,
    "\n  query IsWordSaved($wordId: ID!) {\n    isWordSaved(wordId: $wordId)\n  }\n": typeof types.IsWordSavedDocument,
    "\n  mutation SaveWord($input: WordIdInput!) {\n    saveWord(input: $input) {\n      id\n      createdAt\n      word {\n        id\n        character\n        pinyin\n        english\n        category\n      }\n    }\n  }\n": typeof types.SaveWordDocument,
    "\n  mutation UnsaveWord($input: WordIdInput!) {\n    unsaveWord(input: $input)\n  }\n": typeof types.UnsaveWordDocument,
    "\n  mutation CompleteProvince($input: ProvinceIdInput!) {\n    completeProvince(input: $input) {\n      id\n      completed\n    }\n  }\n": typeof types.CompleteProvinceDocument,
};
const documents: Documents = {
    "\n  query CurrentUser {\n    currentUser {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n": types.CurrentUserDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n": types.MeDocument,
    "\n  query Courses {\n    courses {\n      id\n      name\n      description\n      level\n      imageUrl\n      lessonCount\n      provinces {\n        id\n        name\n        capital\n        unlockOrder\n        color\n        imageUrl\n      }\n    }\n  }\n": types.CoursesDocument,
    "\n  query Course($id: ID!) {\n    course(id: $id) {\n      id\n      name\n      description\n      level\n      provinces {\n        id\n        name\n        capital\n        unlockOrder\n        color\n        imageUrl\n      }\n    }\n  }\n": types.CourseDocument,
    "\n  query Provinces {\n    provinces {\n      id\n      name\n      capital\n      unlockOrder\n      color\n      imageUrl\n    }\n  }\n": types.ProvincesDocument,
    "\n  query Province($id: ID!) {\n    province(id: $id) {\n      id\n      name\n      capital\n      culturalDescription\n      landmark\n      landmarkFact\n      food\n      foodDescription\n      custom\n      unlockOrder\n      color\n      imageUrl\n      storyContent\n      vocabulary {\n        id\n        character\n        pinyin\n        english\n        category\n        travelSentence\n      }\n      grammar {\n        id\n        title\n        explanation\n        examples\n      }\n      exercises {\n        id\n        type\n        question\n        questionLabel\n        options\n        correctAnswer\n      }\n    }\n  }\n": types.ProvinceDocument,
    "\n  query NextProvince {\n    nextProvince {\n      id\n      name\n      capital\n      unlockOrder\n      color\n    }\n  }\n": types.NextProvinceDocument,
    "\n  query IsProvinceUnlocked($provinceId: ID!) {\n    isProvinceUnlocked(provinceId: $provinceId)\n  }\n": types.IsProvinceUnlockedDocument,
    "\n  query Vocabulary($provinceId: ID) {\n    vocabulary(provinceId: $provinceId) {\n      id\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      srsState\n      isDue\n      isSaved\n      province {\n        name\n        color\n      }\n    }\n  }\n": types.VocabularyDocument,
    "\n  query Word($id: ID!) {\n    word(id: $id) {\n      id\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      srsState\n      isDue\n      isSaved\n      province {\n        name\n        color\n      }\n    }\n  }\n": types.WordDocument,
    "\n  query UserProgress {\n    userProgress {\n      provinceId\n      completed\n      score\n      exercisesDone\n      lastStudiedAt\n    }\n    wordProgress {\n      wordId\n      state\n      masteryLevel\n      reps\n      lapses\n      lastReviewedAt\n      nextReviewAt\n    }\n  }\n": types.UserProgressDocument,
    "\n  query DueCards($limit: Int, $mode: ReviewMode, $provinceId: ID) {\n    dueCards(limit: $limit, mode: $mode, provinceId: $provinceId) {\n      wordId\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      state\n    }\n  }\n": types.DueCardsDocument,
    "\n  query ReviewStats {\n    reviewStats {\n      cardsDue\n      newCardsToday\n      reviewedToday\n      retentionPct\n      streak\n      longestStreak\n    }\n  }\n": types.ReviewStatsDocument,
    "\n  mutation StartReviewSession($input: StartReviewSessionInput!) {\n    startReviewSession(input: $input) {\n      id\n      mode\n      cards {\n        wordId\n        character\n        pinyin\n        english\n        category\n        travelSentence\n        masteryLevel\n        state\n      }\n      totalCards\n    }\n  }\n": types.StartReviewSessionDocument,
    "\n  mutation RecordReview($input: RecordReviewInput!) {\n    recordReview(input: $input) {\n      wordId\n      masteryLevel\n      state\n      nextReviewAt\n      sessionReviewed\n      sessionCorrect\n    }\n  }\n": types.RecordReviewDocument,
    "\n  query Exercises($provinceId: ID!) {\n    exercises(provinceId: $provinceId) {\n      id\n      type\n      question\n      questionLabel\n      options\n      correctAnswer\n    }\n  }\n": types.ExercisesDocument,
    "\n  mutation SubmitAnswer($input: SubmitAnswerInput!) {\n    submitAnswer(input: $input) {\n      correct\n      exerciseId\n      correctAnswer\n      partialCredit\n      score\n      exercisesDone\n    }\n  }\n": types.SubmitAnswerDocument,
    "\n  query SavedWords {\n    savedWords {\n      id\n      createdAt\n      word {\n        id\n        character\n        pinyin\n        english\n        category\n        travelSentence\n      }\n    }\n  }\n": types.SavedWordsDocument,
    "\n  query IsWordSaved($wordId: ID!) {\n    isWordSaved(wordId: $wordId)\n  }\n": types.IsWordSavedDocument,
    "\n  mutation SaveWord($input: WordIdInput!) {\n    saveWord(input: $input) {\n      id\n      createdAt\n      word {\n        id\n        character\n        pinyin\n        english\n        category\n      }\n    }\n  }\n": types.SaveWordDocument,
    "\n  mutation UnsaveWord($input: WordIdInput!) {\n    unsaveWord(input: $input)\n  }\n": types.UnsaveWordDocument,
    "\n  mutation CompleteProvince($input: ProvinceIdInput!) {\n    completeProvince(input: $input) {\n      id\n      completed\n    }\n  }\n": types.CompleteProvinceDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CurrentUser {\n    currentUser {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query CurrentUser {\n    currentUser {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Me {\n    me {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Courses {\n    courses {\n      id\n      name\n      description\n      level\n      imageUrl\n      lessonCount\n      provinces {\n        id\n        name\n        capital\n        unlockOrder\n        color\n        imageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query Courses {\n    courses {\n      id\n      name\n      description\n      level\n      imageUrl\n      lessonCount\n      provinces {\n        id\n        name\n        capital\n        unlockOrder\n        color\n        imageUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Course($id: ID!) {\n    course(id: $id) {\n      id\n      name\n      description\n      level\n      provinces {\n        id\n        name\n        capital\n        unlockOrder\n        color\n        imageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query Course($id: ID!) {\n    course(id: $id) {\n      id\n      name\n      description\n      level\n      provinces {\n        id\n        name\n        capital\n        unlockOrder\n        color\n        imageUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Provinces {\n    provinces {\n      id\n      name\n      capital\n      unlockOrder\n      color\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  query Provinces {\n    provinces {\n      id\n      name\n      capital\n      unlockOrder\n      color\n      imageUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Province($id: ID!) {\n    province(id: $id) {\n      id\n      name\n      capital\n      culturalDescription\n      landmark\n      landmarkFact\n      food\n      foodDescription\n      custom\n      unlockOrder\n      color\n      imageUrl\n      storyContent\n      vocabulary {\n        id\n        character\n        pinyin\n        english\n        category\n        travelSentence\n      }\n      grammar {\n        id\n        title\n        explanation\n        examples\n      }\n      exercises {\n        id\n        type\n        question\n        questionLabel\n        options\n        correctAnswer\n      }\n    }\n  }\n"): (typeof documents)["\n  query Province($id: ID!) {\n    province(id: $id) {\n      id\n      name\n      capital\n      culturalDescription\n      landmark\n      landmarkFact\n      food\n      foodDescription\n      custom\n      unlockOrder\n      color\n      imageUrl\n      storyContent\n      vocabulary {\n        id\n        character\n        pinyin\n        english\n        category\n        travelSentence\n      }\n      grammar {\n        id\n        title\n        explanation\n        examples\n      }\n      exercises {\n        id\n        type\n        question\n        questionLabel\n        options\n        correctAnswer\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query NextProvince {\n    nextProvince {\n      id\n      name\n      capital\n      unlockOrder\n      color\n    }\n  }\n"): (typeof documents)["\n  query NextProvince {\n    nextProvince {\n      id\n      name\n      capital\n      unlockOrder\n      color\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query IsProvinceUnlocked($provinceId: ID!) {\n    isProvinceUnlocked(provinceId: $provinceId)\n  }\n"): (typeof documents)["\n  query IsProvinceUnlocked($provinceId: ID!) {\n    isProvinceUnlocked(provinceId: $provinceId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Vocabulary($provinceId: ID) {\n    vocabulary(provinceId: $provinceId) {\n      id\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      srsState\n      isDue\n      isSaved\n      province {\n        name\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  query Vocabulary($provinceId: ID) {\n    vocabulary(provinceId: $provinceId) {\n      id\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      srsState\n      isDue\n      isSaved\n      province {\n        name\n        color\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Word($id: ID!) {\n    word(id: $id) {\n      id\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      srsState\n      isDue\n      isSaved\n      province {\n        name\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  query Word($id: ID!) {\n    word(id: $id) {\n      id\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      srsState\n      isDue\n      isSaved\n      province {\n        name\n        color\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UserProgress {\n    userProgress {\n      provinceId\n      completed\n      score\n      exercisesDone\n      lastStudiedAt\n    }\n    wordProgress {\n      wordId\n      state\n      masteryLevel\n      reps\n      lapses\n      lastReviewedAt\n      nextReviewAt\n    }\n  }\n"): (typeof documents)["\n  query UserProgress {\n    userProgress {\n      provinceId\n      completed\n      score\n      exercisesDone\n      lastStudiedAt\n    }\n    wordProgress {\n      wordId\n      state\n      masteryLevel\n      reps\n      lapses\n      lastReviewedAt\n      nextReviewAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query DueCards($limit: Int, $mode: ReviewMode, $provinceId: ID) {\n    dueCards(limit: $limit, mode: $mode, provinceId: $provinceId) {\n      wordId\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      state\n    }\n  }\n"): (typeof documents)["\n  query DueCards($limit: Int, $mode: ReviewMode, $provinceId: ID) {\n    dueCards(limit: $limit, mode: $mode, provinceId: $provinceId) {\n      wordId\n      character\n      pinyin\n      english\n      category\n      travelSentence\n      masteryLevel\n      state\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ReviewStats {\n    reviewStats {\n      cardsDue\n      newCardsToday\n      reviewedToday\n      retentionPct\n      streak\n      longestStreak\n    }\n  }\n"): (typeof documents)["\n  query ReviewStats {\n    reviewStats {\n      cardsDue\n      newCardsToday\n      reviewedToday\n      retentionPct\n      streak\n      longestStreak\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation StartReviewSession($input: StartReviewSessionInput!) {\n    startReviewSession(input: $input) {\n      id\n      mode\n      cards {\n        wordId\n        character\n        pinyin\n        english\n        category\n        travelSentence\n        masteryLevel\n        state\n      }\n      totalCards\n    }\n  }\n"): (typeof documents)["\n  mutation StartReviewSession($input: StartReviewSessionInput!) {\n    startReviewSession(input: $input) {\n      id\n      mode\n      cards {\n        wordId\n        character\n        pinyin\n        english\n        category\n        travelSentence\n        masteryLevel\n        state\n      }\n      totalCards\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RecordReview($input: RecordReviewInput!) {\n    recordReview(input: $input) {\n      wordId\n      masteryLevel\n      state\n      nextReviewAt\n      sessionReviewed\n      sessionCorrect\n    }\n  }\n"): (typeof documents)["\n  mutation RecordReview($input: RecordReviewInput!) {\n    recordReview(input: $input) {\n      wordId\n      masteryLevel\n      state\n      nextReviewAt\n      sessionReviewed\n      sessionCorrect\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Exercises($provinceId: ID!) {\n    exercises(provinceId: $provinceId) {\n      id\n      type\n      question\n      questionLabel\n      options\n      correctAnswer\n    }\n  }\n"): (typeof documents)["\n  query Exercises($provinceId: ID!) {\n    exercises(provinceId: $provinceId) {\n      id\n      type\n      question\n      questionLabel\n      options\n      correctAnswer\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SubmitAnswer($input: SubmitAnswerInput!) {\n    submitAnswer(input: $input) {\n      correct\n      exerciseId\n      correctAnswer\n      partialCredit\n      score\n      exercisesDone\n    }\n  }\n"): (typeof documents)["\n  mutation SubmitAnswer($input: SubmitAnswerInput!) {\n    submitAnswer(input: $input) {\n      correct\n      exerciseId\n      correctAnswer\n      partialCredit\n      score\n      exercisesDone\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SavedWords {\n    savedWords {\n      id\n      createdAt\n      word {\n        id\n        character\n        pinyin\n        english\n        category\n        travelSentence\n      }\n    }\n  }\n"): (typeof documents)["\n  query SavedWords {\n    savedWords {\n      id\n      createdAt\n      word {\n        id\n        character\n        pinyin\n        english\n        category\n        travelSentence\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query IsWordSaved($wordId: ID!) {\n    isWordSaved(wordId: $wordId)\n  }\n"): (typeof documents)["\n  query IsWordSaved($wordId: ID!) {\n    isWordSaved(wordId: $wordId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SaveWord($input: WordIdInput!) {\n    saveWord(input: $input) {\n      id\n      createdAt\n      word {\n        id\n        character\n        pinyin\n        english\n        category\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SaveWord($input: WordIdInput!) {\n    saveWord(input: $input) {\n      id\n      createdAt\n      word {\n        id\n        character\n        pinyin\n        english\n        category\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnsaveWord($input: WordIdInput!) {\n    unsaveWord(input: $input)\n  }\n"): (typeof documents)["\n  mutation UnsaveWord($input: WordIdInput!) {\n    unsaveWord(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CompleteProvince($input: ProvinceIdInput!) {\n    completeProvince(input: $input) {\n      id\n      completed\n    }\n  }\n"): (typeof documents)["\n  mutation CompleteProvince($input: ProvinceIdInput!) {\n    completeProvince(input: $input) {\n      id\n      completed\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;