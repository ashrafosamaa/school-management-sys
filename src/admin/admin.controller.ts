import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request, Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { createAdminSchema, IDSchema, loginAdminSchema, updateMyAccountSchema } from './admin.zod-schema';
import { AuthAdminGuard } from 'src/guards';


@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(createAdminSchema))
    @UseGuards(AuthAdminGuard)
    async createAdmin(
        @Body() body: any,
        @Res() res: Response
    ) {
        await this.adminService.createAdmin(body)
        res.status(201).json({
            message: 'Admin created successfully',
            statusCode: 201
        })
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(loginAdminSchema))
    async login(
        @Body() body: any,
        @Res() res: Response
    ) {
        const token = await this.adminService.login(body)
        res.status(200).json({
            message: 'Admin logged in successfully',
            statusCode: 200,
            token
        })
    }

    @Get('byId/:adminId')
    @UsePipes(new ZodValidationPipe(IDSchema))
    async getAdmin(
        @Param() params: any,
        @Res() res: Response
    ) {
        const admin = await this.adminService.getAdmin(params)
        res.status(200).json({
            message: 'Admin account fetched successfully',
            statusCode: 200,
            admin
        })
    }

    @Get()
    async getAllAdmins(
        @Res() res: Response
    ) {
        const admins = await this.adminService.getAllAdmins()
        res.status(200).json({
            message: 'Admin accounts fetched successfully',
            statusCode: 200,
            admins
        })
    }

    @Put()
    @UsePipes(new ZodValidationPipe(updateMyAccountSchema))
    @UseGuards(AuthAdminGuard)
    async updateMyAccount(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: any,
    ) {
        const admin = await this.adminService.updateMyAccount(body, req)
        res.status(200).json({
            message: 'Your account updated successfully',
            statusCode: 200,
            admin
        })
    }

    @Delete()
    @UseGuards(AuthAdminGuard)
    async deleteMyAccount(
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.adminService.deleteMyAccount(req)
        res.status(200).json({
            message: 'Your account deleted successfully',
            statusCode: 200
        })
    }

}
