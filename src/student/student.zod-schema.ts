import { z } from 'zod';

export class StudentZodSchema {
    static createStudentSchema = z.object({
        fullName: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 64 characters long' }),
        email: z.string().email({ message: 'Invalid email address' }),
        nationalId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
            .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }),
        phone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        parentPhone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }),
        address: z.string().min(5, { message: 'Name must be at least 5 characters long' })
            .max(128, { message: 'Name must be at most 128 characters long' }),
        birthDate: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/, { message: 'Birth date must be only digits' })
            .length(10, { message: 'Birth date must be exactly 10 digits' }), //09-04-2011
        gender: z.enum(['male', 'female']),
        totalFees: z.string().regex(/^[0-9]+$/, { message: 'Total fees must be only digits' }),
        grade: z.enum(["k1", "k2", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"]),
        classNum: z.enum(["A", "B", "C"]),
    })

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

    static loginStudentSchema = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password pattern is not valid'
            }),
    }).required()

    static IDSchema = z.object({
        studentId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required()

    static getAllStudentsSchema = z.object({
        page: z.string().regex(/^[0-9]+$/, { message: 'Page must be only digits' }).optional(),
        size: z.string().regex(/^[0-9]+$/, { message: 'Size must be only digits' }).optional(),
        sort: z.string().regex(/^(\w+)\s(asc|desc)$/, 
            { message: 'Sort must be 2 words first word is field and second asc or desc' }).optional()
    }).optional()

    static searchStudentsSchema = z.object({
        nationalId: z.string().regex(/^[0-9]+$/, { message: 'Must be only digits' }).optional()
    }).required()

    static updateStudentSchema = z.object({
        fullName: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 64 characters long' }).optional(),
        email: z.string().email({ message: 'Invalid email address' }).optional(),
        nationalId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
            .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }).optional(),
        phone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        parentPhone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        address: z.string().min(5, { message: 'Name must be at least 5 characters long' })
            .max(128, { message: 'Name must be at most 128 characters long' }).optional(),
        birthDate: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/, { message: 'Birth date must be only digits' })
            .length(10, { message: 'Birth date must be exactly 10 digits' }).optional(), //09-04-2011
        gender: z.enum(['male', 'female']).optional(),
        totalFees: z.string().regex(/^[0-9]+$/, { message: 'Total fees must be only digits' }).optional(),
        grade: z.enum(["k1", "k2", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"]).optional(),
        classNum: z.enum(["A", "B", "C"]).optional(),
        paidFees: z.string().regex(/^[0-9]+$/, { message: 'Paid fees must be only digits' }).optional(),
        fessStatus: z.enum(["paid", "unpaid"]).optional(),
    })

    static updateMyAccSchema = z.object({
        fullName: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 64 characters long' }).optional(),
        email: z.string().email({ message: 'Invalid email address' }).optional(),
        nationalId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
            .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }).optional(),
        phone: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        address: z.string().min(5, { message: 'Name must be at least 5 characters long' })
            .max(128, { message: 'Name must be at most 128 characters long' }).optional(),
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
