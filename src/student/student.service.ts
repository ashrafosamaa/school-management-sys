import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/DB/models/student.model';
import * as bcrypt from 'bcrypt'
import { cloudinaryConn } from 'src/utils/cloudinary-connection';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name) private studentModel : Model<Student>,
        private jwtService: JwtService
    ) {}

    async createStudent(body: any, file:any) {
        const { fullName, nationalId, email, phone, parentPhone, address, birthDate, gender, totalFees, grade, classNum } = body
        const studentnId = await this.studentModel.findOne({ nationalId })
        if(studentnId) throw new BadRequestException('Student national ID already exists')
        const student = await this.studentModel.findOne({ email })
        if(student) throw new BadRequestException('Student email already exists')
        const hashPassword = bcrypt.hashSync(nationalId, parseInt(process.env.SALT_ROUNDS_1))
        // upload photo
        if(!file) throw new BadRequestException('File picture not found')
        const folderId = Math.floor(1000 + Math.random() * 9000).toString();
        const {secure_url, public_id} = await cloudinaryConn().uploader.upload(file.path, {
            folder: `${process.env.MAIN_FOLDER}/Students/${folderId}`
        })
        const url = secure_url
        const publicId = public_id
        const profileImg = { url, publicId }
        await this.studentModel.create({ fullName, nationalId, email, phone, parentPhone, address, birthDate,
            gender, password: hashPassword, totalFees, grade, classNum, profileImg, folderId })
        return true
    }

    async firstUse(body: any) {
        const {email, password, newPassword} = body
        const student = await this.studentModel.findOne({ email })
        if(!student) throw new BadRequestException('Email not found')
        if(!bcrypt.compareSync(password, student.password)) throw new BadRequestException('Invalid password')
        const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SALT_ROUNDS_1))
        student.password = hashPassword
        student.isAccountActivated = true
        await student.save()
        return true
    }

    async login(body: any) {
        const { email, password } = body
        const student = await this.studentModel.findOne({ email })
        if(!student) throw new BadRequestException('Email not found')
        if(!student.isAccountActivated) throw new BadRequestException('Please activate your account first')
        if(!bcrypt.compareSync(password, student.password)) throw new BadRequestException('Invalid password')
        const studentToken = this.jwtService.sign({ id: student._id, name: student.fullName, eamil: student.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return studentToken
    }

    async getStudent(params: any) {
        const student = await this.studentModel.findOne({ _id: params.studentId, isAccountActivated: true })
            .select(' fullName email phone address parentPhone birthDate gender totalFees grade classNum paidFees fessStatus profileImg.url ')
        console.log(params.studentId);
        
        if(!student) throw new BadRequestException('Student not found')
        return student
    }

    async getAllStudents() {
        const students = await this.studentModel.find({ isAccountActivated: true })
            .select(' fullName email parentPhone gender totalFees grade classNum fessStatus ')
        if(!students.length) throw new BadRequestException('No students found')
        return students
    }

    async updateStudentAcc(body: any, params: any) {
        const student = await this.studentModel.findById(params.studentId)
        if(!student) throw new BadRequestException('student not found')
        if(body.fullName) student.fullName = body.fullName
        if(body.nationalId) student.nationalId = body.nationalId
        if(body.email) student.email = body.email
        if(body.phone) student.phone = body.phone
        if(body.parentPhone) student.parentPhone = body.parentPhone
        if(body.address) student.address = body.address
        if(body.birthDate) student.birthDate = body.birthDate
        if(body.gender) student.gender = body.gender
        if(body.totalFees) student.totalFees = body.totalFees
        if(body.grade) student.grade = body.grade
        if(body.classNum) student.classNum = body.classNum
        if(body.paidFees) student.paidFees = body.paidFees
        if(body.fessStatus) student.fessStatus = body.fessStatus
        await student.save()
        return true
    }

    async updateStudentImg(file:any, params: any, body: any) {
        if(!file) throw new BadRequestException('File not found')
        const student = await this.studentModel.findById(params.studentId)
        if(!student) throw new BadRequestException('Student not found')
        // upload photo
        if(student.profileImg.publicId != body.oldPublicId) throw new BadRequestException('Profile image not found')
        const newPublicId = body.oldPublicId.split(`${student.folderId}/`)[1]
        const {secure_url, public_id} = await cloudinaryConn().uploader.upload(file.path, {
            folder: `${process.env.MAIN_FOLDER}/Students/${student.folderId}`,
            public_id: newPublicId
        })
        student.profileImg.url = secure_url
        student.profileImg.publicId = public_id
        await student.save()
        return true
    }

    async deleteStudentAcc(params: any) {
        const student = await this.studentModel.findById(params.studentId)
        if(!student) throw new BadRequestException('Student account not found')
        await student.deleteOne()
        return true
    }

    async resetStudentPassword(params: any) {
        const student = await this.studentModel.findById(params.studentId)
        if(!student) throw new BadRequestException('Student account not found')
        const hashPassword = bcrypt.hashSync(student.nationalId, parseInt(process.env.SALT_ROUNDS_1))
        student.password = hashPassword
        student.isAccountActivated = false
        await student.save()
        return true
    }

    async getMyAcc(req: any) {
        const student = await this.studentModel.findById(req.authStudent.id)
            .select(' fullName email phone address parentPhone birthDate gender totalFees grade classNum paidFees fessStatus profileImg.url ')
        return student
    }

    async updateMyAcc(body: any, req: any) {
        const student = await this.studentModel.findById(req.authStudent.id)
        if(!student) throw new BadRequestException('student account not found')
        const { fullName, email, phone, nationalId, address } = body
        if(fullName) student.fullName = fullName
        if(nationalId) student.nationalId = nationalId
        if(email) student.email = email
        if(phone) student.phone = phone
        if(address) student.address = address
        await student.save()
        return true
    }

    async updateMyPassword(body: any, req: any) {
        const student = await this.studentModel.findById(req.authStudent.id)
        if(!student) throw new BadRequestException('Student account not found')
        const { oldPassword, newPassword } = body
        if(!bcrypt.compareSync(oldPassword, student.password)) throw new BadRequestException('Invalid old password')
        const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SALT_ROUNDS_1))
        student.password = hashPassword
        await student.save()
        const studentToken = this.jwtService.sign({ id: student._id, name: student.fullName, eamil: student.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return studentToken
    }

    async deleteMyAcc(req: any) {
        const student = await this.studentModel.findById(req.authStudent.id)
        if(!student) throw new BadRequestException('Student account not found')
        await student.deleteOne()
        return true
    }

}
