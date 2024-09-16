import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Request, Response } from 'express';
import { AuthAdminGuard, AuthTeacherGuard, } from 'src/guards';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { TeacherZodSchema } from './teacher.zod-schema';


@Controller('teacher')
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService,
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.createTeacherSchema))
    @UseGuards(AuthAdminGuard)
    async createTeacher(
        @Body() body: any,
        @Res() res: Response
    ) {
        await this.teacherService.createTeacher(body)
        res.status(201).json({
            message: 'Teacher account created successfully',
            statusCode: 201
        })
    }

    @Put()
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.firtUseSchema))
    async firstUse(
        @Body() body: any,
        @Res() res: Response
    ) {
        await this.teacherService.firstUse(body)
        res.status(200).json({
            message: 'Your password updated successfully, please login again now',
            statusCode: 200
        })
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.loginTeacherSchema))
    async login(
        @Body() body: any,
        @Res() res: Response
    ) {
        const token = await this.teacherService.login(body)
        res.status(200).json({
            message: 'Teacher logged in successfully',
            statusCode: 200,
            token
        })
    }

    @Get('byId/:teacherId')
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.IDSchema))
    async getTeacher(
        @Param() params: any,
        @Res() res: Response,
    ) {
        const teacher = await this.teacherService.getTeacher(params)
        res.status(200).json({
            message: 'Teacher found successfully',
            statusCode: 200,
            teacher
        })
    }

    @Get()
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.getAllTeachersSchema))
    async getAllTeachers(
        @Res() res: Response,
        @Query() query: any
    ) {
        const teachers = await this.teacherService.getAllTeachers(query)
        res.status(200).json({
            message: 'Teachers found successfully',
            statusCode: 200,
            teachers
        })
    }

    @Get('search')
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.searchTeachersSchema))
    async searchTeachers(
        @Res() res: Response,
        @Query() query: any
    ) {
        const teachers = await this.teacherService.searchTeachers(query)
        res.status(200).json({
            message: 'Teachers found successfully',
            statusCode: 200,
            teachers
        })
    }

    @Put('byId/:teacherId')
    @UseGuards(AuthAdminGuard)
    async updateTeacherAcc(
        @Param(new ZodValidationPipe(TeacherZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(TeacherZodSchema.updateTeacherAccSchema)) body: any,
        @Res() res: Response
    ) {
        await this.teacherService.updateTeacherAcc(body, params)
        res.status(200).json({
            message: 'Teacher updated successfully',
            statusCode: 200,
        })
    }

    @Delete('byId/:teacherId')
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async deleteTeacherAcc(
        @Param() params: any,
        @Res() res: Response
    ) {
        await this.teacherService.deleteTeacherAcc(params)
        res.status(200).json({
            message: 'Teacher deleted successfully',
            statusCode: 200,
        })
    }

    @Patch('resetPassword/:teacherId')
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async resetTeacherPassword(
        @Param() params: any,
        @Res() res: Response
    ) {
        await this.teacherService.resetTeacherPassword(params)
        res.status(200).json({
            message: 'Teacher password updated successfully',
            statusCode: 200,
        })
    }

    @Put('myAcc')
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.updateMyAccSchema))
    @UseGuards(AuthTeacherGuard)
    async updateMyAcc(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.teacherService.updateMyAcc(body, req)
        res.status(200).json({
            message: 'Your account updated successfully',
            statusCode: 200,
        })
    }

    @Patch('myAcc')
    @UsePipes(new ZodValidationPipe(TeacherZodSchema.updateMyPasswordSchema))
    @UseGuards(AuthTeacherGuard)
    async updateMyPassword(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const token = await this.teacherService.updateMyPassword(body, req)
        res.status(200).json({
            message: 'Your password updated successfully',
            statusCode: 200,
            token
        })
    }

    @Delete('myAcc')
    @UseGuards(AuthTeacherGuard)
    async deleteMyAcc(
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.teacherService.deleteMyAcc(req)
        res.status(200).json({
            message: 'Your account deleted successfully',
            statusCode: 200,
        })
    }

    @Put('scores-before-final/:studentId')
    @UseGuards(AuthTeacherGuard)
    async updateResultBFinal(
        @Param(new ZodValidationPipe(TeacherZodSchema.studentIdSchema)) params: any,
        @Body(new ZodValidationPipe(TeacherZodSchema.updateResultBFinalSchema)) body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const student = await this.teacherService.updateResultBFinal(body, params, req)
        res.status(200).json({
            message: 'Student results updated successfully',
            statusCode: 200,
            student
        })
    }

    @Put('scores-after-final/:studentId')
    @UseGuards(AuthTeacherGuard)
    async updateResultAFinal(
        @Param(new ZodValidationPipe(TeacherZodSchema.studentIdSchema)) params: any,
        @Body(new ZodValidationPipe(TeacherZodSchema.updateResultAFinalSchema)) body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const student = await this.teacherService.updateResultAFinal(body, params, req)
        res.status(200).json({
            message: 'Student results updated successfully',
            statusCode: 200,
            student
        })
    }

}
