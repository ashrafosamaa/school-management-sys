import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/DB/models/student.model';
import * as bcrypt from 'bcrypt'

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name) private studentModel : Model<Student>,
    ) {}

    async createStudent(body: any) {
        const { username, nId, password } = body
        const student = await this.studentModel.findOne({ nId })
        if(student) throw new BadRequestException('Student national ID already exists')
        const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS_1))
        await this.studentModel.create({ username, nId, password: hashPassword, role: 'student' })
        return true
    }

}
