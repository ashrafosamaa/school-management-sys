import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/DB/models/student.model';


@Injectable()
export class AuthStudentGuard implements CanActivate {
    constructor(
        private jwtService : JwtService,
        @InjectModel(Student.name) private studentModel : Model<Student>,
    ) { }
    async canActivate(
        context : ExecutionContext,
    ) : Promise<object> {
        const req = context.switchToHttp().getRequest();
        const { accesstoken } = req.headers
        if (!accesstoken) {
            throw new BadRequestException('Pleaee lognIn first')
        }
        const decodedData = this.jwtService.verify(accesstoken, { secret: process.env.JWT_SECRET })
        if (!decodedData.id) {
            throw new BadRequestException('Invalid token payload')
        }
        const student = await this.studentModel.findById(decodedData.id)
        if (!student) {
            throw new BadRequestException('Unauthorized, Please signup first')
        }
        req.authStudent = student
        return req
    }
}
