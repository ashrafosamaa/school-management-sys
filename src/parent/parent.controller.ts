import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, Res, UsePipes } from '@nestjs/common';
import { ParentService } from './parent.service';
import { Request, Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { ParentZodSchema } from './parent.zod-schema';

@Controller('parent')
export class ParentController {
    constructor(
        private readonly parentService: ParentService
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(ParentZodSchema.getAllParentsSchema))
    async getAllParents(
        @Query() query: any ,
        @Res() res: Response
    ) {
        const parents = await this.parentService.getAllParents(query)
        res.status(200).json({
            message: 'Parents fetched successfully',
            statusCode: 200,
            parents
        })
    }

    @Get('byId/:parentId')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.getParentSchema))
    async getParent(
        @Param() params: any,
        @Res() res: Response
    ) {
        const parent = await this.parentService.getParent(params)
        res.status(200).json({
            message: 'Parent fetched successfully',
            statusCode: 200,
            parent
        })
    }

    @Get('search')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.searchParentSchema))
    async searchParent(
        @Query() query: any,
        @Res() res: Response
    ) {
        const parents = await this.parentService.searchParent(query)
        res.status(200).json({
            message: 'Parents fetched successfully',
            statusCode: 200,
            parents
        })
    }

    @Put('byId/:parentId')
    async updateParentAcc(
        @Param(new ZodValidationPipe(ParentZodSchema.getParentSchema)) params: any,
        @Body(new ZodValidationPipe(ParentZodSchema.updateParentAccSchema)) body: any,
        @Res() res: Response
    ) {
        await this.parentService.updateParentAcc(body, params)
        res.status(200).json({
            message: 'Parent account updated successfully',
            statusCode: 200,
        })
    }

    @Delete('byId/:parentId')
    async deleteParentAcc(
        @Param(new ZodValidationPipe(ParentZodSchema.getParentSchema)) params: any,
        @Res() res: Response
    ) {
        await this.parentService.deleteParentAcc(params)
        res.status(200).json({
            message: 'Parent account deleted successfully',
            statusCode: 200,
        })
    }

    @Get('myAcc')
    async getMyAcc(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parent = await this.parentService.getMyAcc(req)
        res.status(200).json({
            message: 'Parent fetched successfully',
            statusCode: 200,
            parent
        })
    }

    @Put('newSon')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.sonSchema))
    async addNewSon(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parent = await this.parentService.addNewSon(body, req)
        res.status(200).json({
            message: 'Parent account updated successfully',
            statusCode: 200,
            parent
        })
    }

    @Delete('remove-son')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.sonSchema))
    async deleteSon(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parent = await this.parentService.deleteSon(body, req)
        res.status(200).json({
            message: 'Parent account updated successfully',
            statusCode: 200,
            parent
        })
    }

    @Put('myAcc')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.updateParentAccSchema))
    async updateMyAcc(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.parentService.updateMyAcc(body, req)
        res.status(200).json({
            message: 'Parent account updated successfully',
            statusCode: 200,
        })
    }

    @Patch('password')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.updateMyPasswordSchema))
    async updateMyPassword(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const token = await this.parentService.updateMyPassword(body, req)
        res.status(200).json({
            message: 'Your password updated successfully',
            statusCode: 200,
            token
        })
    }

    @Delete('myAcc')
    async deleteMyAcc(
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.parentService.deleteMyAcc(req)
        res.status(200).json({
            message: 'Your account deleted successfully',
            statusCode: 200,
        })
    }

    @Get('son/scores')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.getSonResultSchema))
    async getStudentCoursesByParent(
        @Param() params: any,
        @Res() res: Response
    ) {
        const scores = await this.parentService.getStudentCoursesByParent(params)
        res.status(200).json({
            message: 'Student scores fetched successfully',
            statusCode: 200,
            scores
        })
    }

}
