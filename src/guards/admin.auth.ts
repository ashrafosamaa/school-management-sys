import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/DB/models/admin.model';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService : JwtService,
        @InjectModel(Admin.name) private adminModel : Model<Admin>,
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
        const admin = await this.adminModel.findById(decodedData.id)
        if (!admin) {
            throw new BadRequestException('Unauthorized, Please signup first')
        }
        req.authAdmin = admin
        return req
    }
}
