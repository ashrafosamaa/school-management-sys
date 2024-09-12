import { z } from 'zod';


export const createAdminSchema = z.object({
        username: z.string().min(3, { message: 'Admin name must be at least 3 characters long' })
            .max(15, { message: 'Admin name must be at most 16 characters long' }),
        nId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
            .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }),
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


export const IDSchema = z.object({
    adminId: z.string().length(24, { message: 'Admin ID must be exactly 24 characters long' })
        .regex(/^[a-fA-F0-9]+$/, { message: 'Admin ID must be a valid hexadecimal string' })
}).required()


export const loginAdminSchema = z.object({
    nId: z.string().length(14, { message: 'National ID must be exactly 14 digits' })
        .regex(/^[0-9]+$/, { message: 'National ID must only contain digits' }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
            message: 'Password pattern is not valid'
        }),
}).required()


export const updateMyAccountSchema = z.object({
    username: z.string().min(3, { message: 'Admin name must be at least 3 characters long' })
        .max(15, { message: 'Admin name must be at most 16 characters long' }).optional(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
            message: 'Password pattern is not valid'
        }).optional(),
})
