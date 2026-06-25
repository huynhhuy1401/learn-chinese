'use client';

import { useQuery, useMutation, QueryResult, MutationResult, ApolloError } from '@apollo/client';
import {
  CurrentUserDocument,
  CurrentUserQuery,
  CurrentUserQueryVariables,
 DueCardsDocument,
  DueCardsQuery,
  DueCardsQueryVariables,
  ReviewStatsDocument,
  ReviewStatsQuery,
  ReviewStatsQueryVariables,
  StartReviewSessionDocument,
  StartReviewSessionMutation,
  StartReviewSessionMutationVariables,
  RecordReviewMutation,
  RecordReviewMutationVariables,
  RecordReviewDocument,
  SubmitAnswerMutation,
  SubmitAnswerMutationVariables,
  SubmitAnswerDocument,
  SaveWordMutation,
  SaveWordMutationVariables,
  SaveWordDocument,
  UnsaveWordMutation,
  UnsaveWordMutationVariables,
  UnsaveWordDocument,
  IsWordSavedDocument,
  IsWordSavedQuery,
  IsWordSavedQueryVariables,
  SavedWordsDocument,
  SavedWordsQuery,
  SavedWordsQueryVariables,
  UserProgressDocument,
  UserProgressQuery,
  UserProgressQueryVariables,
  IsProvinceUnlockedDocument,
  IsProvinceUnlockedQuery,
  IsProvinceUnlockedQueryVariables,
  CompleteProvinceMutation,
  CompleteProvinceMutationVariables,
  CompleteProvinceDocument,
  CoursesDocument,
  CoursesQuery,
  CoursesQueryVariables,
  CourseDocument,
  CourseQuery,
  CourseQueryVariables,
  ProvincesDocument,
  ProvincesQuery,
  ProvincesQueryVariables,
  ProvinceDocument,
  ProvinceQuery,
  ProvinceQueryVariables,
  VocabularyDocument,
  VocabularyQuery,
  VocabularyQueryVariables,
  WordDocument,
  WordQuery,
  WordQueryVariables,
} from '@/graphql/__generated__/graphql';
import type { ReviewMode, ReviewRating } from '@/types/domain';

// Auth ------------------------------------------------------------------------
export function useCurrentUserQuery() {
  return useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument);
}

// Reviewed --------------------------------------------------------------------
export function useDueCards(options?: { limit?: number; mode?: ReviewMode; provinceId?: string; skip?: boolean }) {
  return useQuery<DueCardsQuery, DueCardsQueryVariables>(DueCardsDocument, {
    variables: {
      limit: options?.limit ?? 20,
      mode: options?.mode ?? 'DAILY',
      provinceId: options?.provinceId,
    },
    skip: options?.skip,
    fetchPolicy: 'cache-and-network',
  });
}

export function useReviewStats(skip = false): QueryResult<ReviewStatsQuery, ReviewStatsQueryVariables> {
  return useQuery<ReviewStatsQuery, ReviewStatsQueryVariables>(ReviewStatsDocument, {
    skip,
    fetchPolicy: 'cache-and-network',
  });
}

export function useStartReviewSession(): [
  (vars: { mode: ReviewMode; provinceId?: string; limit?: number }) => Promise<{ data?: StartReviewSessionMutation; errors?: ApolloError }>,
  MutationResult<StartReviewSessionMutation>,
] {
  const [mutate, result] = useMutation<StartReviewSessionMutation, StartReviewSessionMutationVariables>(StartReviewSessionDocument);
  const fn = async (vars: { mode: ReviewMode; provinceId?: string; limit?: number }) => {
    const res = await mutate({
      variables: {
        input: {
          mode: vars.mode,
          provinceId: vars.provinceId ?? null,
          limit: vars.limit ?? 20,
        },
      },
    });
    return { data: res.data ?? undefined, errors: res.errors as unknown as ApolloError | undefined };
  };
  return [fn, result];
}

export function useRecordReview(): [
  (vars: { sessionId: string; wordId: string; rating: ReviewRating }) => Promise<{ data?: RecordReviewMutation; errors?: ApolloError }>,
  MutationResult<RecordReviewMutation>,
] {
  const [mutate, result] = useMutation<RecordReviewMutation, RecordReviewMutationVariables>(RecordReviewDocument);
  const fn = async (vars: { sessionId: string; wordId: string; rating: ReviewRating }) => {
    const res = await mutate({
      variables: {
        input: {
          sessionId: vars.sessionId,
          wordId: vars.wordId,
          rating: vars.rating,
        },
      },
    });
    return { data: res.data ?? undefined, errors: res.errors as unknown as ApolloError | undefined };
  };
  return [fn, result];
}

// Exercises -------------------------------------------------------------------
export function useSubmitAnswer(): [
  (vars: { exerciseId: string; answer: string; provinceId: string }) => Promise<{ data?: SubmitAnswerMutation; errors?: ApolloError }>,
  MutationResult<SubmitAnswerMutation>,
] {
  const [mutate, result] = useMutation<SubmitAnswerMutation, SubmitAnswerMutationVariables>(SubmitAnswerDocument);
  const fn = async (vars: { exerciseId: string; answer: string; provinceId: string }) => {
    const res = await mutate({
      variables: {
        input: {
          exerciseId: vars.exerciseId,
          answer: vars.answer,
          provinceId: vars.provinceId,
        },
      },
    });
    return { data: res.data ?? undefined, errors: res.errors as unknown as ApolloError | undefined };
  };
  return [fn, result];
}

// Saved words -----------------------------------------------------------------
export function useSavedWords(skip = false): QueryResult<SavedWordsQuery, SavedWordsQueryVariables> {
  return useQuery<SavedWordsQuery, SavedWordsQueryVariables>(SavedWordsDocument, {
    skip,
    fetchPolicy: 'cache-and-network',
  });
}

export function useIsWordSaved(wordId: string): QueryResult<IsWordSavedQuery, IsWordSavedQueryVariables> {
  return useQuery<IsWordSavedQuery, IsWordSavedQueryVariables>(IsWordSavedDocument, {
    variables: { wordId },
    fetchPolicy: 'cache-and-network',
  });
}

export function useSaveWord(): [
  (wordId: string) => Promise<{ data?: SaveWordMutation; errors?: ApolloError }>,
  MutationResult<SaveWordMutation>,
] {
  const [mutate, result] = useMutation<SaveWordMutation, SaveWordMutationVariables>(SaveWordDocument, {
    refetchQueries: [{ query: IsWordSavedDocument, variables: { wordId: '' } }, { query: SavedWordsDocument }],
  });
  const fn = async (wordId: string) => {
    const res = await mutate({
      variables: { input: { wordId } },
      refetchQueries: ['IsWordSaved', 'SavedWords'],
    });
    return { data: res.data ?? undefined, errors: res.errors as unknown as ApolloError | undefined };
  };
  return [fn, result];
}

export function useUnsaveWord(): [
  (wordId: string) => Promise<{ data?: UnsaveWordMutation; errors?: ApolloError }>,
  MutationResult<UnsaveWordMutation>,
] {
  const [mutate, result] = useMutation<UnsaveWordMutation, UnsaveWordMutationVariables>(UnsaveWordDocument);
  const fn = async (wordId: string) => {
    const res = await mutate({
      variables: { input: { wordId } },
      refetchQueries: ['IsWordSaved', 'SavedWords'],
    });
    return { data: res.data ?? undefined, errors: res.errors as unknown as ApolloError | undefined };
  };
  return [fn, result];
}

// Progress --------------------------------------------------------------------
export function useUserProgress(skip = false): QueryResult<UserProgressQuery, UserProgressQueryVariables> {
  return useQuery<UserProgressQuery, UserProgressQueryVariables>(UserProgressDocument, {
    skip,
    fetchPolicy: 'cache-and-network',
  });
}

export function useCompleteProvince(): [
  (provinceId: string) => Promise<{ data?: CompleteProvinceMutation; errors?: ApolloError }>,
  MutationResult<CompleteProvinceMutation>,
] {
  const [mutate, result] = useMutation<CompleteProvinceMutation, CompleteProvinceMutationVariables>(CompleteProvinceDocument);
  const fn = async (provinceId: string) => {
    const res = await mutate({ variables: { input: { provinceId } } });
    return { data: res.data ?? undefined, errors: res.errors as unknown as ApolloError | undefined };
  };
  return [fn, result];
}

// Courses / Provinces / Vocabulary -------------------------------------------
export function useCourses(): QueryResult<CoursesQuery, CoursesQueryVariables> {
  return useQuery<CoursesQuery, CoursesQueryVariables>(CoursesDocument);
}

export function useCourse(id: string): QueryResult<CourseQuery, CourseQueryVariables> {
  return useQuery<CourseQuery, CourseQueryVariables>(CourseDocument, { variables: { id } });
}

export function useProvinces(): QueryResult<ProvincesQuery, ProvincesQueryVariables> {
  return useQuery<ProvincesQuery, ProvincesQueryVariables>(ProvincesDocument);
}

export function useIsProvinceUnlocked(provinceId: string, skip = false): QueryResult<IsProvinceUnlockedQuery, IsProvinceUnlockedQueryVariables> {
  return useQuery<IsProvinceUnlockedQuery, IsProvinceUnlockedQueryVariables>(IsProvinceUnlockedDocument, {
    variables: { provinceId },
    skip,
    fetchPolicy: 'cache-and-network',
  });
}

export function useProvince(id: string): QueryResult<ProvinceQuery, ProvinceQueryVariables> {
  return useQuery<ProvinceQuery, ProvinceQueryVariables>(ProvinceDocument, { variables: { id } });
}

export function useVocabulary(provinceId?: string): QueryResult<VocabularyQuery, VocabularyQueryVariables> {
  return useQuery<VocabularyQuery, VocabularyQueryVariables>(VocabularyDocument, {
    variables: { provinceId: provinceId ?? null },
  });
}

export function useWord(id: string): QueryResult<WordQuery, WordQueryVariables> {
  return useQuery<WordQuery, WordQueryVariables>(WordDocument, { variables: { id } });
}