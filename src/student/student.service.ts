import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/DB/models/student.model';
import * as bcrypt from 'bcrypt'
import { cloudinaryConn } from 'src/utils/cloudinary-connection';
import { JwtService } from '@nestjs/jwt';
import { APIFeatures } from 'src/utils/api-feature';
import { Course } from 'src/DB/models/course.model';
import { StudentCourse } from 'src/DB/models/student-courses.model';


@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name) private studentModel : Model<Student>,
        @InjectModel(Course.name) private courseModel : Model<Course>,
        @InjectModel(StudentCourse.name) private studentCourseModel : Model<StudentCourse>,
        private jwtService: JwtService
    ) {}

    async createStudent(body: any, file:any) {
        const { fullName, nationalId, email, phone, parentPhone, address, birthDate, gender, totalFees, grade, classNum } = body
        const studentnId = await this.studentModel.findOne({ nationalId })
        if(studentnId) throw new BadRequestException('Student national ID already exists')
        const student = await this.studentModel.findOne({ email })
        if(student) throw new BadRequestException('Student email already exists')
        const hashPassword = bcrypt.hashSync(nationalId, +process.env.SALT_ROUNDS_1)
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
        if(!student) throw new ConflictException('Email not found')
        if(!bcrypt.compareSync(password, student.password)) throw new BadRequestException('Invalid password')
        const hashPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS_1)
        student.password = hashPassword
        student.isAccountActivated = true
        await student.save()
        return true
    }

    async login(body: any) {
        const { email, password } = body
        const student = await this.studentModel.findOne({ email })
        if(!student) throw new ConflictException('Email not found')
        if(!student.isAccountActivated) throw new BadRequestException('Please activate your account first')
        if(!bcrypt.compareSync(password, student.password)) throw new BadRequestException('Invalid password')
        const studentToken = this.jwtService.sign({ id: student._id, name: student.fullName, eamil: student.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return studentToken
    }

    async getStudent(params: any) {
        const student = await this.studentModel.findOne({ _id: params.studentId, isAccountActivated: true })
            .select(' fullName email phone address parentPhone birthDate gender totalFees grade classNum paidFees fessStatus profileImg.url ')
        if(!student) throw new ConflictException('Student not found')
        return student
    }

    async getAllStudents(query: any) {
        const { page, size, sort } = query
        const features = new APIFeatures(query, this.studentModel.find({ isAccountActivated: true })
            .select(' fullName email parentPhone gender totalFees grade classNum fessStatus '))
            .pagination({ page, size })
            .sort(sort)
        const students = await features.mongooseQuery
        if(!students.length) throw new ConflictException('No students found')
        return students
    }

    async searchStudents(query: any) {
        const { ...search } = query
        const features = new APIFeatures(query, this.studentModel.find({ isAccountActivated: true })
            .select(' fullName email parentPhone gender totalFees grade classNum fessStatus nationalId '))
            .searchStudents(search)
        const students = await features.mongooseQuery
        if(!students.length) throw new ConflictException('No students found')
        return students
    }

    async updateStudentAcc(body: any, params: any) {
        const student = await this.studentModel.findById(params.studentId)
        if(!student) throw new ConflictException('Student not found')
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
        if(!student) throw new ConflictException('Student not found')
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
        if(!student) throw new ConflictException('Student account not found')
        await student.deleteOne()
        return true
    }

    async resetStudentPassword(params: any) {
        const student = await this.studentModel.findById(params.studentId)
        if(!student) throw new ConflictException('Student account not found')
        const hashPassword = bcrypt.hashSync(student.nationalId, +process.env.SALT_ROUNDS_1)
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
        const { oldPassword, newPassword } = body
        if(!bcrypt.compareSync(oldPassword, student.password)) throw new BadRequestException('Invalid old password')
        const hashPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS_1)
        student.password = hashPassword
        await student.save()
        const studentToken = this.jwtService.sign({ id: student._id, name: student.fullName, eamil: student.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return studentToken
    }

    async deleteMyAcc(req: any) {
        const student = await this.studentModel.findById(req.authStudent.id)
        await student.deleteOne()
        return true
    }

    async addCourse(body: any, params: any) {
        const student = await this.studentModel.findById(params.studentId)
        if(!student) throw new ConflictException('Student account not found')
        const isCourse = await this.courseModel.findById(body.courseId);
        if(!isCourse) throw new ConflictException('Course not found')
        const isCourseAdded = await this.studentCourseModel.findOne({ studentId: params.studentId })
        if(!isCourseAdded) { await this.studentCourseModel.create({
            studentId: params.studentId,
            courses:[{title: isCourse.title, courseId: body.courseId, year: body.year, term: body.term}] 
            })
        } else {
            // check if address already exists
            const courseExists = isCourseAdded.courses.some(c => c.courseId.toString() === body.courseId);
            if (courseExists) {
                throw new ConflictException('Course already added');
            }
            await isCourseAdded.updateOne({
                $addToSet: { courses: { title: isCourse.title, courseId: body.courseId, year: body.year, term: body.term } }
            })
            await isCourseAdded.save()
        }
        return true
    }

    async getStudentCoursesByAdmin(params: any) {
        const student = await this.studentCourseModel.findOne({studentId: params.studentId})
            .select('studentId courses')
            .populate({ path: 'studentId', select: 'fullName grade classNum'})
            .populate({ path: 'courses.updatedBy', select: 'name'});
        if(!student) throw new ConflictException('Student has no courses added yet')
        return student
    }

    async deleteCourse(params: any, body: any) {
        const student = await this.studentCourseModel.findOne({studentId: params.studentId})
            .select('studentId courses')
            .populate({
                path: 'studentId',
                select: 'fullName grade classNum',
            });
        if(!student) throw new ConflictException('Student already has no courses added')
        // check if address already exists
        const courseExists = student.courses.some(c => c.courseId.toString() === body.courseId);
        if (!courseExists) {
            throw new ConflictException('Course not found');
        }
        const studentCourses = await this.studentCourseModel.findOneAndUpdate(
            { studentId: params.studentId },
            { $pull: { courses: { courseId: body.courseId }}},
            { new: true})
            .select('studentId courses')
            .populate({ path: 'studentId', select: 'fullName grade classNum'})
            .populate({ path: 'courses.updatedBy', select: 'name'});
        return studentCourses
    }

    async getStudentCoursesByStudent(req: any) {
        const student = await this.studentCourseModel.findOne({studentId: req.authStudent.id})
            .select('studentId courses')
            .populate({ path: 'studentId', select: 'fullName grade classNum'})
            .populate({ path: 'courses.updatedBy', select: 'name'});
        if(!student) throw new ConflictException('Student has no courses added yet')
        return student
    }

}
