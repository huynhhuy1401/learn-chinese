'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

const IS_SAVED = gql`
  query IsWordSaved($wordId: ID!) {
    isWordSaved(wordId: $wordId)
  }
`;

const SAVE_WORD = gql`
  mutation SaveWord($wordId: ID!) {
    saveWord(wordId: $wordId) { id }
  }
`;

const UNSAVE_WORD = gql`
  mutation UnsaveWord($wordId: ID!) {
    unsaveWord(wordId: $wordId)
  }
`;

interface SaveWordButtonProps {
  wordId: string;
  size?: 'sm' | 'md';
}

export function SaveWordButton({ wordId, size = 'sm' }: SaveWordButtonProps) {
  const { data, loading } = useQuery(IS_SAVED, { variables: { wordId } });
  const [saveWord] = useMutation(SAVE_WORD, {
    refetchQueries: ['IsWordSaved', 'SavedWords'],
  });
  const [unsaveWord] = useMutation(UNSAVE_WORD, {
    refetchQueries: ['IsWordSaved', 'SavedWords'],
  });

  const isSaved = data?.isWordSaved;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isSaved) {
        await unsaveWord({ variables: { wordId } });
        toast.success('Removed from flashcards');
      } else {
        await saveWord({ variables: { wordId } });
        toast.success('Added to flashcards!');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Login to save words');
    }
  };

  if (loading) return null;

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      onClick={handleToggle}
      className={`shrink-0 transition-colors ${
        isSaved
          ? 'text-amber-500 hover:text-amber-600'
          : 'text-muted-foreground hover:text-amber-500'
      }`}
      title={isSaved ? 'Remove from flashcards' : 'Save to flashcards'}
    >
      {isSaved ? <BookmarkCheck className={iconSize} /> : <Bookmark className={iconSize} />}
    </button>
  );
}
