import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './dto/course.dto';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private coursesService: CoursesService) {}

  @Query(() => [Course])
  async courses() {
    const courses = await this.coursesService.findAll();
    return courses.map((c) => ({
      ...c,
      lessonCount: c._count?.provinces ?? 0,
    }));
  }

  @Query(() => Course, { nullable: true })
  async course(@Args('id', { type: () => ID }) id: string) {
    return this.coursesService.findById(id);
  }
}
