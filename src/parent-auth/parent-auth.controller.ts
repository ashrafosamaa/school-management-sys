import { Body, Controller, Patch, Post, Res, UsePipes } from '@nestjs/common';
import { ParentAuthService } from './parent-auth.service';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { ParentAuthZodSchema } from './parent-auth.zod-schema';


@Controller('parentAuth')
export class ParentAuthController {
    constructor(
        private readonly parentAuthService: ParentAuthService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(ParentAuthZodSchema.signUpSchema))
    async signUp(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.parentAuthService.signUp(body)
        res.status(201).json({
            message: 'Your account created successfully, check your email for verification code',
            statusCode: 201
        })
    }

    @Post('confirm-email')
    @UsePipes(new ZodValidationPipe(ParentAuthZodSchema.confirmEmailSchema))
    async confirmEmail(
        @Body()body: any,
        @Res() res: Response
    ) {
        const parentToken = await this.parentAuthService.confirmEmail(body)
        res.status(200).json({
            message: 'Account activated successfully',
            statusCode: 200,
            parentToken
        })
    }

    @Post('resend-code')
    @UsePipes(new ZodValidationPipe(ParentAuthZodSchema.resendCode))
    async resendCode(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.parentAuthService.resendCode(body)
        res.status(200).json({
            message: 'Verification code sent successfully, check your email for verification code',
            statusCode: 200
        })
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(ParentAuthZodSchema.loginSchema))
    async login(
        @Body()body: any,
        @Res() res: Response
    ) {
        const parentToken = await this.parentAuthService.login(body)
        res.status(200).json({
            message: 'Parent logged in successfully',
            statusCode: 200,
            parentToken
        })
    }

    @Post('forgot-password')
    @UsePipes(new ZodValidationPipe(ParentAuthZodSchema.resendCode))
    async forgotPasswordReq(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.parentAuthService.forgotPassword(body)
        res.status(200).json({
            message: 'Password reset code sent successfully, check your email for reset your password',
            statusCode: 200
        })
    }

    @Post('verify-password-code')
    @UsePipes(new ZodValidationPipe(ParentAuthZodSchema.verifyPasswordResetCode))
    async verifyPasswordResetCode(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.parentAuthService.verifyPasswordResetCode(body)
        res.status(200).json({
            message: 'Code verified successfully, enter new password',
            statusCode: 200
        })
    }

    @Patch('reset-password')
    @UsePipes(new ZodValidationPipe(ParentAuthZodSchema.resetPassword))
    async resetPassword(
        @Body()body: any,
        @Res() res: Response
    ) {
        const token = await this.parentAuthService.resetPassword(body)
        res.status(200).json({
            message: 'Password changed successfully',
            statusCode: 200,
            token
        })
    }

}
