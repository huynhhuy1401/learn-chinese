import { ExerciseType } from '@prisma/client';
import { ExerciseStrategyFactory } from './exercise-strategy.factory';
import { StrategyExercise } from './strategy.types';

const factory = new ExerciseStrategyFactory();
const base: StrategyExercise = {
  id: 'ex1', type: ExerciseType.MULTIPLE_CHOICE, question: 'q',
  questionLabel: null, options: '[]', correctAnswer: 'Hello',
};

describe('Exercise strategies', () => {
  it('MCQ is case-insensitive exact match', () => {
    const r = factory.for(ExerciseType.MULTIPLE_CHOICE).evaluate(base, 'hello');
    expect(r.correct).toBe(true);

    const r2 = factory.for(ExerciseType.MULTIPLE_CHOICE).evaluate(base, 'goodbye');
    expect(r2.correct).toBe(false);
  });

  it('RECALL_MEANING accepts lower-cased meaning, partial credit', () => {
    const r = factory.for(ExerciseType.RECALL_MEANING)
      .evaluate({ ...base, correctAnswer: 'thank you' }, 'Thank You');
    expect(r.correct).toBe(true);
    expect(r.partialCredit).toBe(1);
  });

  it('RECALL_READING is tone-insensitive', () => {
    const r = factory.for(ExerciseType.RECALL_READING)
      .evaluate({ ...base, correctAnswer: 'nǐ hǎo' }, 'ni hao');
    expect(r.correct).toBe(true);
  });

  it('LISTENING accepts either char or pinyin', () => {
    const r = factory.for(ExerciseType.LISTENING)
      .evaluate({ ...base, options: JSON.stringify(['ni hao']), correctAnswer: '你好' }, 'ni hao');
    expect(r.correct).toBe(true);
    const r2 = factory.for(ExerciseType.LISTENING)
      .evaluate({ ...base, options: JSON.stringify(['ni hao']), correctAnswer: '你好' }, '你好');
    expect(r2.correct).toBe(true);
    const r3 = factory.for(ExerciseType.LISTENING)
      .evaluate({ ...base, options: JSON.stringify(['ni hao']), correctAnswer: '你好' }, 'wrong');
    expect(r3.correct).toBe(false);
  });

  it('TONE uses a numeric tone number', () => {
    const r = factory.for(ExerciseType.TONE)
      .evaluate({ ...base, correctAnswer: '3' }, '3');
    expect(r.correct).toBe(true);
    const r2 = factory.for(ExerciseType.TONE)
      .evaluate({ ...base, correctAnswer: '3' }, '2');
    expect(r2.correct).toBe(false);
  });

  it('WRITING trusts client verdict correct/incorrect', () => {
    expect(factory.for(ExerciseType.WRITING).evaluate(base, 'correct').correct).toBe(true);
    expect(factory.for(ExerciseType.WRITING).evaluate(base, 'incorrect').correct).toBe(false);
  });

  it('FILL_BLANK accepts pinyin or character', () => {
    const r = factory.for(ExerciseType.FILL_BLANK)
      .evaluate({ ...base, options: JSON.stringify(['shì']), correctAnswer: '是' }, '是');
    expect(r.correct).toBe(true);
    const r2 = factory.for(ExerciseType.FILL_BLANK)
      .evaluate({ ...base, options: JSON.stringify(['shì']), correctAnswer: '是' }, 'shi');
    expect(r2.correct).toBe(true);
    expect(r2.acceptedAnswers).toEqual(['是', 'shì']);
  });

  it('MATCHING grades partial credit per pair', () => {
    const correct = { a: '1', b: '2', c: '3' };
    const r = factory.for(ExerciseType.MATCHING)
      .evaluate({ ...base, correctAnswer: JSON.stringify(correct) }, { a: '1', b: '5', c: '3' });
    expect(r.correct).toBe(false);
    expect(r.partialCredit).toBeCloseTo(2 / 3);
    expect(r.feedback).toContain('2/3');
  });

  it('CULTURAL matches MCQ behaviour', () => {
    const r = factory.for(ExerciseType.CULTURAL).evaluate(base, 'Hello');
    expect(r.correct).toBe(true);
  });
});