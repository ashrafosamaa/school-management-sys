import { z } from 'zod';

export class ParentAuthZodSchema {
    static signUpSchema = z.object({
        name: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }),
        email: z.string().email({ message: 'Invalid email address' }),
        stNationalId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
            .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }),
        phone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }),
        address: z.string().min(5, { message: 'Name must be at least 5 characters long' })
            .max(128, { message: 'Name must be at most 128 characters long' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' 
            }),
        passwordConfirm: z.string()
    }).required().superRefine(({ password, passwordConfirm }, ctx) => {
        if (password !== passwordConfirm) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords don\'t match',
                path: ['passwordConfirm']
            })
        }
    })

    static confirmEmailSchema = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        activateCode: z.string().length(4, { message: 'Activation code must be exactly 4 characters long' })
    }).required()

    static loginSchema = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' 
            })
    }).required()

    static resendCode = z.object({
        email: z.string().email({ message: 'Invalid email address' })
    }).required()

    static verifyPasswordResetCode = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        resetCode: z.string().length(4, { message: 'Password reset code must be exactly 4 characters long' })
    }).required()

    static resetPassword = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' 
            }),
        passwordConfirm: z.string()
    }).required().superRefine(({ password, passwordConfirm }, ctx) => {
        if (password !== passwordConfirm) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords don\'t match',
                path: ['passwordConfirm']
            })
        }
    })

}
