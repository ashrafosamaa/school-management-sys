import { Module } from '@nestjs/common';
import { StudentController } from '../student/student.controller';
import { StudentService } from '../student/student.service';
import { models } from 'src/DB/model-generation';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [models],
  controllers: [StudentController],
  providers: [StudentService, JwtService]
})
export class StudentModule {}
