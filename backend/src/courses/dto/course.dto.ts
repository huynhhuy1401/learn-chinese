import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Province } from '../../provinces/dto/province.dto';

@ObjectType()
export class Course {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  level: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => Int, { nullable: true })
  lessonCount?: number;

  @Field(() => [Province], { nullable: true })
  provinces?: Province[];
}
