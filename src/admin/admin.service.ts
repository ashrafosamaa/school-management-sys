import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/DB/models/admin.model';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AdminService {

    constructor(
        @InjectModel(Admin.name) private adminModel : Model<Admin>,
        private jwtService : JwtService,
    ) {}

    async createAdmin(body: any) {
        const { username, nId, password } = body
        const admin = await this.adminModel.findOne({ nId })
        if(admin) throw new BadRequestException('Admin national ID already exists')
        const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS_1))
        await this.adminModel.create({ username, nId, password: hashPassword, role: 'admin' })
        return true
    }

    async login(body: any) {
        const { nId, password } = body
        const admin = await this.adminModel.findOne({ nId })
        if(!admin) throw new BadRequestException('Invalid login credentials')
        if(!bcrypt.compareSync(password, admin.password)) throw new BadRequestException('Invalid password')
        const adminToken = this.jwtService.sign({ id: admin._id, name: admin.username, nId: admin.nId },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return adminToken
    }

    async getAdmin(params: any) {
        const admin = await this.adminModel.findById(params.adminId).select(' username nId role')
        if(!admin) throw new BadRequestException('Admin not found')
        return admin
    }

    async getAllAdmins() {
        const admins = await this.adminModel.find().select(' username nId role')
        if(!admins.length) throw new BadRequestException('No admins found')
        return admins
    }

    async updateMyAccount(body: any, req: any) {
        const admin = await this.adminModel.findById(req.authAdmin.id).select(' username nId role')
        if(!admin) throw new BadRequestException('Admin not found')
        const { username, nId } = body
        if(username) admin.username = username
        if(nId) admin.nId = nId
        await admin.save()
        return admin
    }

    async deleteMyAccount(req: any) {
        const admin = await this.adminModel.findById(req.authAdmin.id)
        if(!admin) throw new BadRequestException('Admin not found')
        await admin.deleteOne()
        return true
    }

}
