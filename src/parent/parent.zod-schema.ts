import { z } from 'zod';

export class ParentZodSchema {
    static getAllParentsSchema = z.object({
        page: z.string().regex(/^[0-9]+$/, { message: 'Page must be only digits' }).optional(),
        size: z.string().regex(/^[0-9]+$/, { message: 'Size must be only digits' }).optional(),
        sort: z.string().regex(/^(\w+)\s(asc|desc)$/, 
            { message: 'Sort must be 2 words first word is field and second asc or desc' }).optional()
    }).optional()

    static getParentSchema = z.object({
        parentId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required()

    static searchParentSchema = z.object({
        name: z.string()
    }).required()

    static updateParentAccSchema = z.object({
        name: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }).optional(),
        phone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        address: z.string().min(5, { message: 'Name must be at least 5 characters long' })
            .max(128, { message: 'Name must be at most 128 characters long' }).optional(),
    })

    static sonSchema = z.object({
        stNationalId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
            .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }),
    }).required()

    static updateMyPasswordSchema = z.object({
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' }),
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

    static getSonResultSchema = z.object({
        studentId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required()

}
