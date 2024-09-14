import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
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
            statusCode: 200,
            student
        })
    }

    @Get()
    async getAllStudents(
        @Res() res: Response
    ) {
        const students = await this.studentService.getAllStudents()
        res.status(200).json({
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
            statusCode: 200
        })
    }

}
