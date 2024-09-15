import { z } from 'zod';

export class TeacherZodSchema {
    static createTeacherSchema = z.object({
        name: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(15, { message: 'Name must be at most 16 characters long' }),
        email: z.string().email({ message: 'Invalid email address' }),
        phone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }),
        gender: z.enum(['male', 'female'], { message: 'Invalid gender' }),
        specialization: z.enum(['primary', 'junior', 'senior'], { message: 'Invalid specialization' }),
        salary: z.string().regex(/^[0-9]+$/, { message: 'Salary must be only digits' }),
        nationalId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
            .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }),
    }).required()

    static firtUseSchema = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().length(14, { message: 'Password must be National ID only 14 digits' })
            .regex(/^[0-9]+$/, { message: 'Password must be National ID only contain digits' }),
        newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' 
            }),
        newPasswordConfirm: z.string()
    }).required().superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
        if (newPassword !== newPasswordConfirm) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords don\'t match',
                path: ['newPasswordConfirm']
            })
        }
    })

    static loginTeacherSchema = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password pattern is not valid'
            }),
    }).required()

    static IDSchema = z.object({
        teacherId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required()

    static getAllTeachersSchema = z.object({
        page: z.string().regex(/^[0-9]+$/, { message: 'Page must be only digits' }).optional(),
        size: z.string().regex(/^[0-9]+$/, { message: 'Size must be only digits' }).optional(),
        sort: z.string().regex(/^(\w+)\s(asc|desc)$/, 
            { message: 'Sort must be 2 words first word is field and second asc or desc' }).optional()
    }).optional()

    static searchTeachersSchema = z.object({
        nationalId: z.string().regex(/^[0-9]+$/, { message: 'Must be only digits' }).optional()
    }).required()

    static updateTeacherAccSchema = z.object({
        name: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(15, { message: 'Name must be at most 16 characters long' }).optional(),
        email: z.string().email({ message: 'Invalid email address' }).optional(),
        phone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        gender: z.enum(['male', 'female'], { message: 'Invalid gender' }).optional(),
        specialization: z.enum(['primary', 'junior', 'senior'], { message: 'Invalid specialization' }).optional(),
        salary: z.string().regex(/^[0-9]+$/, { message: 'Salary must be only digits' }).optional(),
        nationalId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
            .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }).optional(),
    })

    static resetTeacherPasswordSchema = z.object({
        password: z.string().length(14, { message: 'Password must be National ID only 14 digits' })
            .regex(/^[0-9]+$/, { message: 'Password must be National ID only contain digits' }).optional(),
    })

    static updateMyAccSchema = z.object({
        name: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(15, { message: 'Name must be at most 16 characters long' }).optional(),
        email: z.string().email({ message: 'Invalid email address' }).optional(),
        phone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        nationalId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
            .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }).optional(),
        gender: z.enum(['male', 'female'], { message: 'Invalid gender' }).optional(),
    })

    static updateMyPasswordSchema = z.object({
        oldPassword: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
            message: 'Password pattern is not valid'}),
        newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'}),
        newPasswordConfirm: z.string()
    }).required().superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
        if (newPassword !== newPasswordConfirm) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords don\'t match',
                path: ['newPasswordConfirm']
            })
        }
    })

}
