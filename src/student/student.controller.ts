import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req,
        Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { StudentService } from './student.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImages } from 'src/guards/multer.guard';
import * as Multer from "multer";
import { Request, Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { StudentZodSchema } from './student.zod-schema';
import { AuthAdminGuard } from 'src/guards';
import { AuthStudentGuard } from 'src/guards/student.auth';


@Controller('student')
export class StudentController {
    constructor(
        private readonly studentService: StudentService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('Img', multerImages))
    @UseGuards(AuthAdminGuard)
    async createStudent(
        @UploadedFile() file: Multer.File,
        @Body(new ZodValidationPipe(StudentZodSchema.createStudentSchema)) body: any,
        @Res() res: Response
    ) {
        await this.studentService.createStudent(body, file)
        res.status(201).json({
            message: 'Student account created successfully',
            statusCode: 201
        })
    }

    @Put()
    @UsePipes(new ZodValidationPipe(StudentZodSchema.firtUseSchema))
    async firstUse(
        @Body() body: any,
        @Res() res: Response
    ) {
        await this.studentService.firstUse(body)
        res.status(200).json({
            message: 'Your password updated successfully, please login again now',
            statusCode: 200
        })
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(StudentZodSchema.loginStudentSchema))
    async login(
        @Body() body: any,
        @Res() res: Response
    ) {
        const token = await this.studentService.login(body)
        res.status(200).json({
            message: 'Student logged in successfully',
            statusCode: 200,
            token
        })
    }

    @Get('byId/:studentId')
    @UsePipes(new ZodValidationPipe(StudentZodSchema.IDSchema))
    async getStudent(
        @Param() params: any,
        @Res() res: Response
    ) {
        const student = await this.studentService.getStudent(params)
        res.status(200).json({
            message: 'Student fetched successfully',
            statusCode: 200,
            student
        })
    }

    @Get()
    @UsePipes(new ZodValidationPipe(StudentZodSchema.getAllStudentsSchema))
    async getAllStudents(
        @Res() res: Response,
        @Query() query: any
    ) {
        const students = await this.studentService.getAllStudents(query)
        res.status(200).json({
            message: 'Students fetched successfully',
            statusCode: 200,
            students
        })
    }

    @Get('search')
    @UsePipes(new ZodValidationPipe(StudentZodSchema.searchStudentsSchema))
    async searchStudents(
        @Res() res: Response,
        @Query() query: any
    ) {
        const students = await this.studentService.searchStudents(query)
        res.status(200).json({
            message: 'Students fetched successfully',
            statusCode: 200,
            students
        })
    }

    @Put('byId/:studentId')
    @UseGuards(AuthAdminGuard)
    async updateStudentAcc(
        @Param(new ZodValidationPipe(StudentZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(StudentZodSchema.updateStudentSchema)) body: any,
        @Res() res: Response
    ) {
        await this.studentService.updateStudentAcc(body, params)
        res.status(200).json({
            message: 'Student account updated successfully',
            statusCode: 200,
        })
    }

    @Delete('byId/:studentId')
    @UsePipes(new ZodValidationPipe(StudentZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async deleteStudentAcc(
        @Param() params: any,
        @Res() res: Response
    ) {
        await this.studentService.deleteStudentAcc(params)
        res.status(200).json({
            message: 'Student account deleted successfully',
            statusCode: 200
        })
    }

    @Patch('resetPassword/:studentId')
    @UsePipes(new ZodValidationPipe(StudentZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async resetStudentPassword(
        @Param() params: any,
        @Res() res: Response
    ) {
        await this.studentService.resetStudentPassword(params)
        res.status(200).json({
            message: 'Student password reset successfully',
            statusCode: 200
        })
    }

    @Get('myAcc')
    @UseGuards(AuthStudentGuard)
    async getMyAcc(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const student = await this.studentService.getMyAcc(req)
        res.status(200).json({
            message: 'Your account fetched successfully',
            statusCode: 200,
            student
        })
    }

    @Put('myAcc')
    @UsePipes(new ZodValidationPipe(StudentZodSchema.updateMyAccSchema))
    @UseGuards(AuthStudentGuard)
    async updateMyAcc(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.studentService.updateMyAcc(body, req)
        res.status(200).json({
            message: 'Your account updated successfully',
            statusCode: 200
        })
    }

    @Patch('myAcc')
    @UsePipes(new ZodValidationPipe(StudentZodSchema.updateMyPasswordSchema))
    @UseGuards(AuthStudentGuard)
    async updateMyPassword(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const token = await this.studentService.updateMyPassword(body, req)
        res.status(200).json({
            message: 'Your password updated successfully',
            statusCode: 200,
            token
        })
    }

    @Delete('myAcc')
    @UseGuards(AuthStudentGuard)
    async deleteMyAcc(
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.studentService.deleteMyAcc(req)
        res.status(200).json({
            message: 'Your account deleted successfully',
            statusCode: 200
        })
    }

    @Post('courses/:studentId')
    @UseGuards(AuthAdminGuard)
    async addCourse(
        @Param(new ZodValidationPipe(StudentZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(StudentZodSchema.addCourseSchema)) body: any,
        @Res() res: Response
    ) {
        await this.studentService.addCourse(body, params)
        res.status(201).json({
            message: 'Course added successfully',
            statusCode: 201,
        })
    }

    @Get('courses/:studentId')
    @UsePipes(new ZodValidationPipe(StudentZodSchema.IDSchema))
    async getStudentCoursesByAdmin(
        @Param() params: any,
        @Res() res: Response
    ) {
        const student = await this.studentService.getStudentCoursesByAdmin(params)
        res.status(200).json({
            message: 'Courses fetched successfully',
            statusCode: 200,
            student
        })
    }

    @Put('courses/:studentId')
    @UseGuards(AuthAdminGuard)
    async deleteCourse(
        @Param(new ZodValidationPipe(StudentZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(StudentZodSchema.deleteCourseSchema)) body: any,
        @Res() res: Response
    ) {
        const student = await this.studentService.deleteCourse(params, body)
        res.status(200).json({
            message: 'Course deleted successfully',
            statusCode: 200,
            student
        })
    }

    @Get('mycourses')
    @UseGuards(AuthStudentGuard)
    async getStudentCoursesByStudent(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const student = await this.studentService.getStudentCoursesByStudent(req)
        res.status(200).json({
            message: 'Courses fetched successfully',
            statusCode: 200,
            student
        })
    }

}
