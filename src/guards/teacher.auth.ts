import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from 'src/DB/models/teacher.model';


@Injectable()
export class AuthTeacherGuard implements CanActivate {
    constructor(
        private jwtService : JwtService,
        @InjectModel(Teacher.name) private teacherModel : Model<Teacher>,
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
        const teacher = await this.teacherModel.findById(decodedData.id)
        if (!teacher) {
            throw new BadRequestException('Unauthorized, Please signup first')
        }
        req.authTeacher = teacher
        return req
    }
}
