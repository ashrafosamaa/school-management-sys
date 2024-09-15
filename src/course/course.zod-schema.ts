import { z } from 'zod';

export class CourseZodSchema {
    static addCourseSchema = z.object({
        title: z.string().min(3, { message: 'Course name must be at least 3 characters long' })
            .max(30, { message: 'Course name must be at most 30 characters long' }),
        teachers: z.array(z.string()
            .length(24, { message: 'Teacher ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' }))
            .min(1, { message: 'Course must have at least one teacher' }),
        grades: z.array(z.string()
            .length(2, { message: 'Grade must be exactly 2 characters long' }))
            .min(1, { message: 'Course must have at least one grade' })
    })

    static getCourseById = z.object({
        courseId: z.string()
            .length(24, { message: 'Course ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required()

    static updateCourseSchema = z.object({
        title: z.string().min(3, { message: 'Course name must be at least 3 characters long' })
            .max(30, { message: 'Course name must be at most 30 characters long' }).optional(),
        teachers: z.array(z.string()
            .length(24, { message: 'Teacher ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' }))
            .min(1, { message: 'Course must have at least one teacher' }).optional(),
        grades: z.array(z.string()
            .length(2, { message: 'Grade must be exactly 2 characters long' }))
            .min(1, { message: 'Course must have at least one grade' }).optional()
    })

}
