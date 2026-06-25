/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** FSRS card lifecycle state. */
export type CardState =
  | 'GRADUATED'
  | 'LEARNING'
  | 'NEW'
  | 'RELEARNING'
  | 'REVIEW';

/** Type of exercise item. */
export type ExerciseType =
  | 'CULTURAL'
  | 'FILL_BLANK'
  | 'LISTENING'
  | 'MATCHING'
  | 'MULTIPLE_CHOICE'
  | 'RECALL_MEANING'
  | 'RECALL_READING'
  | 'TONE'
  | 'WRITING';

export type ProvinceIdInput = {
  provinceId: string | number;
};

export type RecordReviewInput = {
  rating: ReviewRating;
  sessionId: string | number;
  wordId: string | number;
};

/** Type of review session. */
export type ReviewMode =
  | 'DAILY'
  | 'LESSON_POST'
  | 'LESSON_PRE'
  | 'SAVED_ONLY';

/** FSRS review rating: AGAIN/Lapse, HARD, GOOD, EASY. */
export type ReviewRating =
  | 'AGAIN'
  | 'EASY'
  | 'GOOD'
  | 'HARD';

export type StartReviewSessionInput = {
  limit?: number | null | undefined;
  mode: ReviewMode;
  provinceId?: string | number | null | undefined;
};

export type SubmitAnswerInput = {
  answer: string;
  exerciseId: string;
  provinceId: string | number;
};

export type WordIdInput = {
  wordId: string | number;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename: 'Query', currentUser: { __typename: 'User', id: string, email: string, name: string, createdAt: string } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename: 'Query', me: { __typename: 'User', id: string, email: string, name: string, createdAt: string } };

export type CoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type CoursesQuery = { __typename: 'Query', courses: Array<{ __typename: 'Course', id: string, name: string, description: string, level: string, imageUrl: string | null, lessonCount: number | null, provinces: Array<{ __typename: 'Province', id: string, name: string, capital: string, unlockOrder: number, color: string, imageUrl: string | null }> | null }> };

export type CourseQueryVariables = Exact<{
  id: string | number;
}>;


export type CourseQuery = { __typename: 'Query', course: { __typename: 'Course', id: string, name: string, description: string, level: string, provinces: Array<{ __typename: 'Province', id: string, name: string, capital: string, unlockOrder: number, color: string, imageUrl: string | null }> | null } | null };

export type ProvincesQueryVariables = Exact<{ [key: string]: never; }>;


export type ProvincesQuery = { __typename: 'Query', provinces: Array<{ __typename: 'Province', id: string, name: string, capital: string, unlockOrder: number, color: string, imageUrl: string | null }> };

export type ProvinceQueryVariables = Exact<{
  id: string | number;
}>;


export type ProvinceQuery = { __typename: 'Query', province: { __typename: 'Province', id: string, name: string, capital: string, culturalDescription: string, landmark: string, landmarkFact: string, food: string, foodDescription: string, custom: string, unlockOrder: number, color: string, imageUrl: string | null, storyContent: string | null, vocabulary: Array<{ __typename: 'VocabularyWord', id: string, character: string, pinyin: string, english: string, category: string, travelSentence: string | null }> | null, grammar: Array<{ __typename: 'GrammarPoint', id: string, title: string, explanation: string, examples: string }> | null, exercises: Array<{ __typename: 'Exercise', id: string, type: ExerciseType, question: string, questionLabel: string | null, options: string, correctAnswer: string }> | null } | null };

export type NextProvinceQueryVariables = Exact<{ [key: string]: never; }>;


export type NextProvinceQuery = { __typename: 'Query', nextProvince: { __typename: 'Province', id: string, name: string, capital: string, unlockOrder: number, color: string } | null };

export type IsProvinceUnlockedQueryVariables = Exact<{
  provinceId: string | number;
}>;


export type IsProvinceUnlockedQuery = { __typename: 'Query', isProvinceUnlocked: boolean };

export type VocabularyQueryVariables = Exact<{
  provinceId?: string | number | null | undefined;
}>;


export type VocabularyQuery = { __typename: 'Query', vocabulary: Array<{ __typename: 'VocabularyWord', id: string, character: string, pinyin: string, english: string, category: string, travelSentence: string | null, masteryLevel: number | null, srsState: CardState | null, isDue: boolean | null, isSaved: boolean | null, province: { __typename: 'WordProvince', name: string, color: string } | null }> };

export type WordQueryVariables = Exact<{
  id: string | number;
}>;


export type WordQuery = { __typename: 'Query', word: { __typename: 'VocabularyWord', id: string, character: string, pinyin: string, english: string, category: string, travelSentence: string | null, masteryLevel: number | null, srsState: CardState | null, isDue: boolean | null, isSaved: boolean | null, province: { __typename: 'WordProvince', name: string, color: string } | null } | null };

export type UserProgressQueryVariables = Exact<{ [key: string]: never; }>;


export type UserProgressQuery = { __typename: 'Query', userProgress: Array<{ __typename: 'UserProgress', provinceId: string, completed: boolean, score: number, exercisesDone: number, lastStudiedAt: string }>, wordProgress: Array<{ __typename: 'UserWordProgress', wordId: string, state: CardState, masteryLevel: number, reps: number, lapses: number, lastReviewedAt: string | null, nextReviewAt: string }> };

export type DueCardsQueryVariables = Exact<{
  limit?: number | null | undefined;
  mode?: ReviewMode | null | undefined;
  provinceId?: string | number | null | undefined;
}>;


export type DueCardsQuery = { __typename: 'Query', dueCards: Array<{ __typename: 'DueCard', wordId: string, character: string, pinyin: string, english: string, category: string, travelSentence: string | null, masteryLevel: number, state: string }> };

export type ReviewStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type ReviewStatsQuery = { __typename: 'Query', reviewStats: { __typename: 'ReviewStats', cardsDue: number, newCardsToday: number, reviewedToday: number, retentionPct: number, streak: number, longestStreak: number } };

export type StartReviewSessionMutationVariables = Exact<{
  input: StartReviewSessionInput;
}>;


export type StartReviewSessionMutation = { __typename: 'Mutation', startReviewSession: { __typename: 'ReviewSessionRef', id: string, mode: ReviewMode, totalCards: number, cards: Array<{ __typename: 'DueCard', wordId: string, character: string, pinyin: string, english: string, category: string, travelSentence: string | null, masteryLevel: number, state: string }> } };

export type RecordReviewMutationVariables = Exact<{
  input: RecordReviewInput;
}>;


export type RecordReviewMutation = { __typename: 'Mutation', recordReview: { __typename: 'ReviewResult', wordId: string, masteryLevel: number, state: string, nextReviewAt: string, sessionReviewed: number, sessionCorrect: number } };

export type ExercisesQueryVariables = Exact<{
  provinceId: string | number;
}>;


export type ExercisesQuery = { __typename: 'Query', exercises: Array<{ __typename: 'Exercise', id: string, type: ExerciseType, question: string, questionLabel: string | null, options: string, correctAnswer: string }> };

export type SubmitAnswerMutationVariables = Exact<{
  input: SubmitAnswerInput;
}>;


export type SubmitAnswerMutation = { __typename: 'Mutation', submitAnswer: { __typename: 'ExerciseResult', correct: boolean, exerciseId: string, correctAnswer: string, partialCredit: number, score: number, exercisesDone: number } };

export type SavedWordsQueryVariables = Exact<{ [key: string]: never; }>;


export type SavedWordsQuery = { __typename: 'Query', savedWords: Array<{ __typename: 'SavedWordResult', id: string, createdAt: string, word: { __typename: 'VocabularyWord', id: string, character: string, pinyin: string, english: string, category: string, travelSentence: string | null } }> };

export type IsWordSavedQueryVariables = Exact<{
  wordId: string | number;
}>;


export type IsWordSavedQuery = { __typename: 'Query', isWordSaved: boolean };

export type SaveWordMutationVariables = Exact<{
  input: WordIdInput;
}>;


export type SaveWordMutation = { __typename: 'Mutation', saveWord: { __typename: 'SavedWordResult', id: string, createdAt: string, word: { __typename: 'VocabularyWord', id: string, character: string, pinyin: string, english: string, category: string } } };

export type UnsaveWordMutationVariables = Exact<{
  input: WordIdInput;
}>;


export type UnsaveWordMutation = { __typename: 'Mutation', unsaveWord: boolean };

export type CompleteProvinceMutationVariables = Exact<{
  input: ProvinceIdInput;
}>;


export type CompleteProvinceMutation = { __typename: 'Mutation', completeProvince: { __typename: 'UserProgress', id: string, completed: boolean } };


export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const CoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"lessonCount"}},{"kind":"Field","name":{"kind":"Name","value":"provinces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"unlockOrder"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]}}]} as unknown as DocumentNode<CoursesQuery, CoursesQueryVariables>;
export const CourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Course"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"provinces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"unlockOrder"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]}}]} as unknown as DocumentNode<CourseQuery, CourseQueryVariables>;
export const ProvincesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Provinces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"provinces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"unlockOrder"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<ProvincesQuery, ProvincesQueryVariables>;
export const ProvinceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Province"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"province"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"culturalDescription"}},{"kind":"Field","name":{"kind":"Name","value":"landmark"}},{"kind":"Field","name":{"kind":"Name","value":"landmarkFact"}},{"kind":"Field","name":{"kind":"Name","value":"food"}},{"kind":"Field","name":{"kind":"Name","value":"foodDescription"}},{"kind":"Field","name":{"kind":"Name","value":"custom"}},{"kind":"Field","name":{"kind":"Name","value":"unlockOrder"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"storyContent"}},{"kind":"Field","name":{"kind":"Name","value":"vocabulary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"travelSentence"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grammar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"explanation"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"questionLabel"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"correctAnswer"}}]}}]}}]}}]} as unknown as DocumentNode<ProvinceQuery, ProvinceQueryVariables>;
export const NextProvinceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NextProvince"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nextProvince"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"unlockOrder"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<NextProvinceQuery, NextProvinceQueryVariables>;
export const IsProvinceUnlockedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IsProvinceUnlocked"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provinceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isProvinceUnlocked"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"provinceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provinceId"}}}]}]}}]} as unknown as DocumentNode<IsProvinceUnlockedQuery, IsProvinceUnlockedQueryVariables>;
export const VocabularyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Vocabulary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provinceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vocabulary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"provinceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provinceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"travelSentence"}},{"kind":"Field","name":{"kind":"Name","value":"masteryLevel"}},{"kind":"Field","name":{"kind":"Name","value":"srsState"}},{"kind":"Field","name":{"kind":"Name","value":"isDue"}},{"kind":"Field","name":{"kind":"Name","value":"isSaved"}},{"kind":"Field","name":{"kind":"Name","value":"province"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]} as unknown as DocumentNode<VocabularyQuery, VocabularyQueryVariables>;
export const WordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Word"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"travelSentence"}},{"kind":"Field","name":{"kind":"Name","value":"masteryLevel"}},{"kind":"Field","name":{"kind":"Name","value":"srsState"}},{"kind":"Field","name":{"kind":"Name","value":"isDue"}},{"kind":"Field","name":{"kind":"Name","value":"isSaved"}},{"kind":"Field","name":{"kind":"Name","value":"province"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]} as unknown as DocumentNode<WordQuery, WordQueryVariables>;
export const UserProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"provinceId"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"exercisesDone"}},{"kind":"Field","name":{"kind":"Name","value":"lastStudiedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"wordProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"masteryLevel"}},{"kind":"Field","name":{"kind":"Name","value":"reps"}},{"kind":"Field","name":{"kind":"Name","value":"lapses"}},{"kind":"Field","name":{"kind":"Name","value":"lastReviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nextReviewAt"}}]}}]}}]} as unknown as DocumentNode<UserProgressQuery, UserProgressQueryVariables>;
export const DueCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DueCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewMode"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provinceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dueCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"mode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mode"}}},{"kind":"Argument","name":{"kind":"Name","value":"provinceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provinceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordId"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"travelSentence"}},{"kind":"Field","name":{"kind":"Name","value":"masteryLevel"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<DueCardsQuery, DueCardsQueryVariables>;
export const ReviewStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReviewStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardsDue"}},{"kind":"Field","name":{"kind":"Name","value":"newCardsToday"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedToday"}},{"kind":"Field","name":{"kind":"Name","value":"retentionPct"}},{"kind":"Field","name":{"kind":"Name","value":"streak"}},{"kind":"Field","name":{"kind":"Name","value":"longestStreak"}}]}}]}}]} as unknown as DocumentNode<ReviewStatsQuery, ReviewStatsQueryVariables>;
export const StartReviewSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartReviewSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartReviewSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startReviewSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordId"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"travelSentence"}},{"kind":"Field","name":{"kind":"Name","value":"masteryLevel"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCards"}}]}}]}}]} as unknown as DocumentNode<StartReviewSessionMutation, StartReviewSessionMutationVariables>;
export const RecordReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecordReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecordReviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordId"}},{"kind":"Field","name":{"kind":"Name","value":"masteryLevel"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextReviewAt"}},{"kind":"Field","name":{"kind":"Name","value":"sessionReviewed"}},{"kind":"Field","name":{"kind":"Name","value":"sessionCorrect"}}]}}]}}]} as unknown as DocumentNode<RecordReviewMutation, RecordReviewMutationVariables>;
export const ExercisesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Exercises"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provinceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exercises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"provinceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provinceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"questionLabel"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"correctAnswer"}}]}}]}}]} as unknown as DocumentNode<ExercisesQuery, ExercisesQueryVariables>;
export const SubmitAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitAnswerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"correct"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseId"}},{"kind":"Field","name":{"kind":"Name","value":"correctAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"partialCredit"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"exercisesDone"}}]}}]}}]} as unknown as DocumentNode<SubmitAnswerMutation, SubmitAnswerMutationVariables>;
export const SavedWordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SavedWords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"savedWords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"travelSentence"}}]}}]}}]}}]} as unknown as DocumentNode<SavedWordsQuery, SavedWordsQueryVariables>;
export const IsWordSavedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IsWordSaved"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isWordSaved"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wordId"}}}]}]}}]} as unknown as DocumentNode<IsWordSavedQuery, IsWordSavedQueryVariables>;
export const SaveWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<SaveWordMutation, SaveWordMutationVariables>;
export const UnsaveWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnsaveWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsaveWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UnsaveWordMutation, UnsaveWordMutationVariables>;
export const CompleteProvinceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteProvince"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProvinceIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeProvince"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}}]}}]}}]} as unknown as DocumentNode<CompleteProvinceMutation, CompleteProvinceMutationVariables>;