import { Module } from '@nestjs/common';
import { CourseController } from '../course/course.controller';
import { CourseService } from '../course/course.service';
import { models } from 'src/DB/model-generation';


@Module({
  imports: [models],
  controllers: [CourseController],
  providers: [CourseService]
})
export class CourseModule {}
