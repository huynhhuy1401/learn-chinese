import { Resolver, Query, Mutation, Args, ID, Context, ObjectType, Field, InputType } from '@nestjs/graphql';
import { UseGuards, Injectable } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { FlashcardsService } from './flashcards.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { VocabularyWord } from '../vocabulary/dto/vocabulary-word.dto';

@ObjectType()
export class SavedWordResult {
  @Field(() => ID)
  id: string;

  @Field(() => VocabularyWord)
  word: VocabularyWord;

  @Field()
  createdAt: Date;
}

@InputType()
export class WordIdInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  wordId: string;
}

@Resolver()
export class FlashcardsResolver {
  constructor(private flashcardsService: FlashcardsService) {}

  @Query(() => [SavedWordResult])
  @UseGuards(SupabaseAuthGuard)
  async savedWords(@Context() ctx: any) {
    return this.flashcardsService.getSavedWords(ctx.req.user.id);
  }

  @Query(() => Boolean)
  @UseGuards(SupabaseAuthGuard)
  async isWordSaved(@Context() ctx: any, @Args('wordId', { type: () => ID }) wordId: string) {
    return this.flashcardsService.isSaved(ctx.req.user.id, wordId);
  }

  @Mutation(() => SavedWordResult)
  @UseGuards(SupabaseAuthGuard)
  async saveWord(@Context() ctx: any, @Args('input') input: WordIdInput) {
    return this.flashcardsService.saveWord(ctx.req.user.id, input.wordId);
  }

  @Mutation(() => Boolean)
  @UseGuards(SupabaseAuthGuard)
  async unsaveWord(@Context() ctx: any, @Args('input') input: WordIdInput) {
    await this.flashcardsService.unsaveWord(ctx.req.user.id, input.wordId);
    return true;
  }
}