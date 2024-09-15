import { Body, Controller, Patch, Post, Res, UsePipes } from '@nestjs/common';
import { ParentService } from './parent.service';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { ParentZodSchema } from './parent.zod-schema';


@Controller('parent')
export class ParentController {
    constructor(
        private readonly parentService: ParentService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(ParentZodSchema.signUpSchema))
    async signUp(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.parentService.signUp(body)
        res.status(201).json({
            message: 'Your account created successfully, check your email for verification code',
            statusCode: 201
        })
    }

    @Post('confirm-email')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.confirmEmailSchema))
    async confirmEmail(
        @Body()body: any,
        @Res() res: Response
    ) {
        const parentToken = await this.parentService.confirmEmail(body)
        res.status(200).json({
            message: 'Account activated successfully',
            statusCode: 200,
            parentToken
        })
    }

    @Post('resend-code')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.resendCode))
    async resendCode(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.parentService.resendCode(body)
        res.status(200).json({
            message: 'Verification code sent successfully, check your email for verification code',
            statusCode: 200
        })
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.loginSchema))
    async login(
        @Body()body: any,
        @Res() res: Response
    ) {
        const parentToken = await this.parentService.login(body)
        res.status(200).json({
            message: 'Parent logged in successfully',
            statusCode: 200,
            parentToken
        })
    }

    @Post('forgot-password')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.resendCode))
    async forgotPasswordReq(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.parentService.forgotPassword(body)
        res.status(200).json({
            message: 'Password reset code sent successfully, check your email for reset your password',
            statusCode: 200
        })
    }

    @Post('verify-password-code')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.verifyPasswordResetCode))
    async verifyPasswordResetCode(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.parentService.verifyPasswordResetCode(body)
        res.status(200).json({
            message: 'Code verified successfully, enter new password',
            statusCode: 200
        })
    }

    @Patch('reset-password')
    @UsePipes(new ZodValidationPipe(ParentZodSchema.resetPassword))
    async resetPassword(
        @Body()body: any,
        @Res() res: Response
    ) {
        const token = await this.parentService.resetPassword(body)
        res.status(200).json({
            message: 'Password changed successfully',
            statusCode: 200,
            token
        })
    }

}
