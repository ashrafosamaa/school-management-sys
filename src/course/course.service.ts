import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/DB/models/course.model';
import { Teacher } from 'src/DB/models/teacher.model';

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(Course.name) private courseModel : Model<Course>,
        @InjectModel(Teacher.name) private teacherModel : Model<Teacher>,
    ) {}

    async addCourse(body: any) {
        const isTeacher = await this.teacherModel.find({ _id: { $in: body.teachers }});
        if (isTeacher.length !== body.teachers.length) throw new BadRequestException('Some teachers are not valid');
        const course = await this.courseModel.create(body);
        if(!course) throw new InternalServerErrorException('Course could not be created');
        return true
    }

    async getAllCourses() {
        const courses = await this.courseModel.find().select('title');
        if(!courses) throw new InternalServerErrorException('No courses found');
        return courses
    }

    async getCourseById(params: any) {
        // Fetch the course and populate the 'teachers' field with only the 'name' field
        const course = await this.courseModel.findById(params.courseId)
            .select('title teachers grades')
            .populate('teachers', 'name');
        if (!course) throw new ConflictException('Course not found');
        return course;
    }

    async updateCourse(params: any, body: any) {
        const course = await this.courseModel.findById(params.courseId);
        if (!course) throw new ConflictException('Course not found');
        if(body.title) course.title = body.title;
        if(body.teachers) course.teachers = body.teachers;
        if(body.grades) course.grades = body.grades;
        await course.save();
        return true;
    }

    async deleteCourse(params: any) {
        const course = await this.courseModel.findByIdAndDelete(params.courseId);
        if (!course) throw new ConflictException('Course not found');
        return true;
    }

}
