import { Body, Controller, Delete, Get, Param, Post, Put, Res, UsePipes } from '@nestjs/common';
import { CourseService } from './course.service';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { CourseZodSchema } from './course.zod-schema';

@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(CourseZodSchema.addCourseSchema))
    async addCourse(
        @Body() body: any,
        @Res() res: Response
    ) {
        await this.courseService.addCourse(body);
        res.status(201).json({
            message : 'Course created successfully',
            statusCode : 201
        })
    }

    @Get()
    async getAllCourses(
        @Res() res: Response
    ) {
        const courses = await this.courseService.getAllCourses();
        res.status(200).json({
            message : 'Courses fetched successfully',
            statusCode : 200,
            courses
        })
    }

    @Get('byId/:courseId')
    @UsePipes(new ZodValidationPipe(CourseZodSchema.getCourseById))
    async getCourseById(
        @Res() res: Response,
        @Param() params: any
    ) {
        const course = await this.courseService.getCourseById(params);
        res.status(200).json({
            message : 'Course fetched successfully',
            statusCode : 200,
            course
        })
    }

    @Put('byId/:courseId')
    async updateCourse(
        @Param(new ZodValidationPipe(CourseZodSchema.getCourseById)) params: any,
        @Body(new ZodValidationPipe(CourseZodSchema.updateCourseSchema)) body: any,
        @Res() res: Response,
    ) {
        await this.courseService.updateCourse(params, body);
        res.status(200).json({
            message : 'Course updated successfully',
            statusCode : 200
        })
    }

    @Delete('byId/:courseId')
    async deleteCourse(
        @Param(new ZodValidationPipe(CourseZodSchema.getCourseById)) params: any,
        @Res() res: Response,
    ) {
        await this.courseService.deleteCourse(params);
        res.status(200).json({
            message : 'Course deleted successfully',
            statusCode : 200
        })
    }
}
