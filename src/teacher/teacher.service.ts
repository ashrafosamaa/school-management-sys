import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from 'src/DB/models/teacher.model';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class TeacherService {
    constructor(
        @InjectModel(Teacher.name) private teacherModel : Model<Teacher>,
        private jwtService: JwtService
    ) {}

    async createTeacher(body: any) {
        const { name, email, phone, specialization, salary, nationalId } = body
        const teachernId = await this.teacherModel.findOne({ nationalId })
        if(teachernId) throw new BadRequestException('Teacher national ID already exists')
        const teacher = await this.teacherModel.findOne({ email })
        if(teacher) throw new BadRequestException('Teacher email already exists')
        const hashPassword = bcrypt.hashSync(nationalId, parseInt(process.env.SALT_ROUNDS_1))
        await this.teacherModel.create({ name, email, phone, password: hashPassword,
            nationalId, specialization, salary, role: 'teacher' })
        return true
    }

    async firstUse(body: any) {
        const {email, password, newPassword} = body
        const teacher = await this.teacherModel.findOne({ email })
        if(!teacher) throw new BadRequestException('Email not found')
        if(!bcrypt.compareSync(password, teacher.password)) throw new BadRequestException('Invalid password')
        const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SALT_ROUNDS_1))
        teacher.password = hashPassword
        teacher.isAccountActivated = true
        await teacher.save()
        return true
    }

    async login(body: any) {
        const { email, password } = body
        const teacher = await this.teacherModel.findOne({ email })
        if(!teacher) throw new BadRequestException('Email not found')
        if(!teacher.isAccountActivated) throw new BadRequestException('Please activate your account first')
        if(!bcrypt.compareSync(password, teacher.password)) throw new BadRequestException('Invalid password')
        const teacherToken = this.jwtService.sign({ id: teacher._id, name: teacher.name, eamil: teacher.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return teacherToken
    }

    async getTeacher(params: any) {
        const teacher = await this.teacherModel.findOne({_id: params.teacherId, isAccountActivated: true})
            .select(' name email phone specialization salary ')
        if(!teacher) throw new BadRequestException('Teacher not found')
        return teacher
    }

    async getAllTeachers() {
        const teachers = await this.teacherModel.find({isAccountActivated: true})
            .select(' name specialization salary ')
        if(!teachers.length) throw new BadRequestException('No teachers found')
        return teachers
    }

    async updateTeacherAcc(body: any, params: any) {
        const teacher = await this.teacherModel.findById(params.teacherId)
        if(!teacher) throw new BadRequestException('Teacher not found')
        const { name, email, phone, specialization, salary, nationalId } = body
        if(name) teacher.name = name
        if(email) teacher.email = email
        if(phone) teacher.phone = phone
        if(specialization) teacher.specialization = specialization
        if(nationalId) teacher.nationalId = nationalId
        if(salary) teacher.salary = salary
        await teacher.save()
        return true
    }

    async deleteTeacherAcc(params: any) {
        const teacher = await this.teacherModel.findById(params.teacherId)
        if(!teacher) throw new BadRequestException('Teacher account not found')
        await teacher.deleteOne()
        return true
    }

    async resetTeacherPassword(params: any) {
        const teacher = await this.teacherModel.findById(params.teacherId)
        if(!teacher) throw new BadRequestException('Teacher account not found')
        const hashPassword = bcrypt.hashSync(teacher.nationalId, parseInt(process.env.SALT_ROUNDS_1))
        teacher.password = hashPassword
        teacher.isAccountActivated = false
        await teacher.save()
        return true
    }

    async updateMyAcc(body: any, req: any) {
        const teacher = await this.teacherModel.findById(req.authTeacher.id)
        if(!teacher) throw new BadRequestException('Teacher account not found')
        const { name, email, phone, nationalId } = body
        if(name) teacher.name = name
        if(email) teacher.email = email
        if(phone) teacher.phone = phone
        if(nationalId) teacher.nationalId = nationalId
        await teacher.save()
        return true
    }

    async updateMyPassword(body: any, req: any) {
        const teacher = await this.teacherModel.findById(req.authTeacher.id)
        if(!teacher) throw new BadRequestException('Teacher account not found')
        const { oldPassword, newPassword } = body
        if(!bcrypt.compareSync(oldPassword, teacher.password)) throw new BadRequestException('Invalid old password')
        const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SALT_ROUNDS_1))
        teacher.password = hashPassword
        await teacher.save()
        const teacherToken = this.jwtService.sign({ id: teacher._id, name: teacher.name, eamil: teacher.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return teacherToken
    }

    async deleteMyAcc(req: any) {
        const teacher = await this.teacherModel.findById(req.authTeacher.id)
        if(!teacher) throw new BadRequestException('Teacher account not found')
        await teacher.deleteOne()
        return true
    }

}
