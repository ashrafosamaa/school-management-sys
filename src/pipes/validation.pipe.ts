import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    path: err.path.join('.'), 
                    message: err.message,
                }));
                throw new BadRequestException({
                    message: 'Validation failed',
                    errors: formattedErrors,
                    statusCode: 400
                });
            }
            throw new BadRequestException('Unexpected validation error');
        }
    }
}