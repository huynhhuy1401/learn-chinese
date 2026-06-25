import type { DueCard, ExerciseType } from '@/types/domain';
import type { RenderItemBase } from './renderer.types';
import { pickItemType, pickDistractors } from './item-type-selector';

/// Transform a due card + sibling words into a render item of the chosen type.
export function buildItemFromCard(
  card: DueCard,
  siblings: DueCard[],
  rotation: number,
  exerciseId = '',
): RenderItemBase {
  const type = pickItemType(card.state, 0, rotation);
  return buildItem(card, siblings, type, rotation, exerciseId);
}

export function buildItem(
  card: DueCard,
  siblings: DueCard[],
  type: ExerciseType,
  _rotation: number,
  exerciseId = '',
): RenderItemBase {
  switch (type) {
    case 'MULTIPLE_CHOICE': {
      const otherEnglish = siblings.filter((s) => s.wordId !== card.wordId).map((s) => s.english);
      const distractors = pickDistractors(otherEnglish, card.english, 3);
      return {
        type,
        word: card,
        options: [card.english, ...distractors].sort(() => Math.random() - 0.5),
        correctAnswer: card.english,
        prompt: 'What does this mean?',
        exerciseId,
      };
    }
    case 'RECALL_MEANING':
      return { type, word: card, correctAnswer: card.english, prompt: 'Type the English meaning', exerciseId };
    case 'RECALL_READING':
      return { type, word: card, correctAnswer: card.pinyin, prompt: 'Type the pinyin reading', exerciseId };
    case 'LISTENING':
      return { type, word: card, prompt: 'Listen and type what you heard (character or pinyin)', exerciseId };
    case 'TONE':
      return { type, word: card, correctAnswer: '', prompt: 'What tone is this syllable?', exerciseId };
    case 'WRITING':
      return { type, word: card, correctAnswer: card.character, prompt: 'Trace the strokes', exerciseId };
    case 'FILL_BLANK': {
      const prompt = card.travelSentence
        ? card.travelSentence.replace(new RegExp(card.character, 'g'), '_____')
        : `Fill the blank: ${card.english}`;
      const options = JSON.stringify([card.pinyin]);
      return { type, word: card, options: options as unknown as undefined, correctAnswer: card.character, prompt, exerciseId };
    }
    case 'MATCHING': {
      // Use up to 4 siblings
      const matchSet = [card, ...siblings.filter((s) => s.wordId !== card.wordId)].slice(0, 4);
      const options = matchSet
        .sort(() => Math.random() - 0.5)
        .map((s) => ({ left: s.character, right: s.english }));
      return {
        type,
        word: card,
        options: options as unknown as string[] | undefined,
        correctAnswer: JSON.stringify(matchSet.map((s) => ({ left: s.character, right: s.english }))),
        prompt: '',
        exerciseId,
      };
    }
    case 'CULTURAL':
    default:
      return { type, word: card, correctAnswer: card.english, prompt: '', exerciseId };
  }
}

// DueCard.question doesn't exist; map legacy exercise items through this builder.
export function buildItemFromExercise(
  ex: {
    id: string;
    type: ExerciseType;
    question: string;
    questionLabel?: string | null;
    options: string;
    correctAnswer: string;
  },
): RenderItemBase {
  return {
    type: ex.type,
    options: JSON.parse(ex.options || '[]'),
    correctAnswer: ex.correctAnswer,
    prompt: ex.question,
    exerciseId: ex.id,
  };
}