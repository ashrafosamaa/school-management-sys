import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { models } from 'src/DB/model-generation';
import { TeacherController } from 'src/teacher/teacher.controller';
import { TeacherService } from 'src/teacher/teacher.service';
import { TeacherZodSchema } from 'src/teacher/teacher.zod-schema';


@Module({
    imports: [models],
    controllers: [TeacherController],
    providers: [TeacherService, JwtService, TeacherZodSchema]
})
export class TeacherModule {}
