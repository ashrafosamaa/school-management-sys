import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parent } from 'src/DB/models/parent.model';


@Injectable()
export class AuthParentGuard implements CanActivate {
    constructor(
        private jwtService : JwtService,
        @InjectModel(Parent.name) private parentModel : Model<Parent>,
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
        const parent = await this.parentModel.findById(decodedData.id)
        if (!parent) {
            throw new BadRequestException('Unauthorized, Please signup first')
        }
        req.authParent = parent
        return req
    }
}
