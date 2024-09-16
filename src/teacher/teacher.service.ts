import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from 'src/DB/models/teacher.model';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { APIFeatures } from 'src/utils/api-feature';
import { StudentCourse } from 'src/DB/models/student-courses.model';


@Injectable()
export class TeacherService {
    constructor(
        @InjectModel(Teacher.name) private teacherModel : Model<Teacher>,
        @InjectModel(StudentCourse.name) private studentCourseModel : Model<StudentCourse>,
        private jwtService: JwtService
    ) {}

    async createTeacher(body: any) {
        const { name, email, phone, specialization, salary, nationalId, gender } = body
        const teachernId = await this.teacherModel.findOne({ nationalId })
        if(teachernId) throw new BadRequestException('Teacher national ID already exists')
        const teacher = await this.teacherModel.findOne({ email })
        if(teacher) throw new BadRequestException('Teacher email already exists')
        const hashPassword = bcrypt.hashSync(nationalId, +process.env.SALT_ROUNDS_1)
        await this.teacherModel.create({ name, email, phone, password: hashPassword,
            nationalId, specialization, salary, gender })
        return true
    }

    async firstUse(body: any) {
        const {email, password, newPassword} = body
        const teacher = await this.teacherModel.findOne({ email })
        if(!teacher) throw new ConflictException('Email not found')
        if(!bcrypt.compareSync(password, teacher.password)) throw new BadRequestException('Invalid password')
        const hashPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS_1)
        teacher.password = hashPassword
        teacher.isAccountActivated = true
        await teacher.save()
        return true
    }

    async login(body: any) {
        const { email, password } = body
        const teacher = await this.teacherModel.findOne({ email })
        if(!teacher) throw new ConflictException('Email not found')
        if(!teacher.isAccountActivated) throw new BadRequestException('Please activate your account first')
        if(!bcrypt.compareSync(password, teacher.password)) throw new BadRequestException('Invalid password')
        const teacherToken = this.jwtService.sign({ id: teacher._id, name: teacher.name, eamil: teacher.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return teacherToken
    }

    async getTeacher(params: any) {
        const teacher = await this.teacherModel.findOne({ _id: params.teacherId })
            .select(' name email phone specialization salary gender ')
        if(!teacher) throw new ConflictException('Teacher not found')
        return teacher
    }

    async getAllTeachers(query: any) {
        const { page, size, sort } = query
        const features = new APIFeatures(query, this.teacherModel.find({ isAccountActivated: true })
            .select(' name email phone salary '))
            .pagination({ page, size })
            .sort(sort)
        const teachers = await features.mongooseQuery
        if(!teachers.length) throw new ConflictException('No teachers found')
        return teachers
    }

    async searchTeachers(query: any) {
        const { ...search } = query
        const features = new APIFeatures(query, this.teacherModel.find()
            .select(' name email phone salary '))
            .searchTeachers(search)
        const teachers = await features.mongooseQuery
        if(!teachers.length) throw new ConflictException('No teachers found')
        return teachers
    }

    async updateTeacherAcc(body: any, params: any) {
        const teacher = await this.teacherModel.findById(params.teacherId)
        if(!teacher) throw new ConflictException('Teacher not found')
        const isNIdExist = await this.teacherModel.findOne({ nationalId: body.nationalId, _id: { $ne: params.teacherId } })
        if(isNIdExist) throw new BadRequestException('National Id already exists')
        const isPhoneExists = await this.teacherModel.findOne({ phone: body.phone, _id: { $ne: params.teacherId } })
        if(isPhoneExists) throw new BadRequestException('Phone number already exists')
        const { name, email, phone, specialization, salary, nationalId, gender } = body
        if(name) teacher.name = name
        if(email) teacher.email = email
        if(phone) teacher.phone = phone
        if(specialization) teacher.specialization = specialization
        if(nationalId) teacher.nationalId = nationalId
        if(salary) teacher.salary = salary
        if(gender) teacher.gender = gender
        await teacher.save()
        return true
    }

    async deleteTeacherAcc(params: any) {
        const teacher = await this.teacherModel.findById(params.teacherId)
        if(!teacher) throw new ConflictException('Teacher account not found')
        await teacher.deleteOne()
        return true
    }

    async resetTeacherPassword(params: any) {
        const teacher = await this.teacherModel.findById(params.teacherId)
        if(!teacher) throw new ConflictException('Teacher account not found')
        const hashPassword = bcrypt.hashSync(teacher.nationalId, +process.env.SALT_ROUNDS_1)
        teacher.password = hashPassword
        teacher.isAccountActivated = false
        await teacher.save()
        return true
    }

    async updateMyAcc(body: any, req: any) {
        const teacher = await this.teacherModel.findById(req.authTeacher.id)
        const isNIdExist = await this.teacherModel.findOne({ nationalId: body.nationalId, _id: { $ne: req.authTeacher.id } })
        if(isNIdExist) throw new BadRequestException('National Id already exists')
        const { name, email, phone, gender } = body
        if(name) teacher.name = name
        if(email) teacher.email = email
        if(phone) teacher.phone = phone
        if(gender) teacher.gender = gender
        await teacher.save()
        return true
    }

    async updateMyPassword(body: any, req: any) {
        const teacher = await this.teacherModel.findById(req.authTeacher.id)
        const { oldPassword, newPassword } = body
        if(!bcrypt.compareSync(oldPassword, teacher.password)) throw new BadRequestException('Invalid old password')
        const hashPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS_1)
        teacher.password = hashPassword
        await teacher.save()
        const teacherToken = this.jwtService.sign({ id: teacher._id, name: teacher.name, eamil: teacher.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return teacherToken
    }

    async deleteMyAcc(req: any) {
        const teacher = await this.teacherModel.findById(req.authTeacher.id)
        await teacher.deleteOne()
        return true
    }

    async updateResultBFinal (body: any, params: any, req: any) {
        const studentCourses = await this.studentCourseModel.findOne(
            { studentId: params.studentId, "courses.courseId": body.courseId },
            { "courses.$": 1 } // Only fetch the specific course
        );
        
        if (!studentCourses || !studentCourses.courses.length) {
            throw new ConflictException('Course not found for the student');
        }
        // Get existing values from the database
        const existingCourse = studentCourses.courses[0];
        const existingOral = existingCourse.oral ?? null;
        const existingAttendance = existingCourse.attendance ?? null;
        const existingPractical = existingCourse.practical ?? null;
        const existingMidterm = existingCourse.midterm ?? null;
        // Update the oral and recalculate total
        const studentCoursesResult = await this.studentCourseModel.findOneAndUpdate(
            { studentId: params.studentId, "courses.courseId": body.courseId },
            { $set: {
                    "courses.$.oral": body.oral ?? existingOral, "courses.$.attendance": body.attendance ?? existingAttendance,
                    "courses.$.practical": body.practical ?? existingPractical, "courses.$.midterm": body.midterm ?? existingMidterm,
                    "courses.$.updatedBy": req.authTeacher.id,
                    "courses.$.totalBFinal":
                        (body.oral ?? existingOral) + 
                        (body.attendance ?? existingAttendance) +
                        (body.practical ?? existingPractical) +
                        (body.midterm ?? existingMidterm) 
                }
            }, { new: true }
        ).select('studentId courses')
        .populate({ path: 'studentId', select: 'fullName grade classNum'})
        .populate({ path: 'courses.updatedBy', select: 'name'});
        return studentCoursesResult
    }

    async updateResultAFinal (body: any, params: any, req: any) {
        const studentCourses = await this.studentCourseModel.findOne(
            { studentId: params.studentId, "courses.courseId": body.courseId },
            { "courses.$": 1 } // Only fetch the specific course
        );
        
        if (!studentCourses || !studentCourses.courses.length) {
            throw new ConflictException('Course not found for the student');
        }
        // Get existing values from the database
        const existingCourse = studentCourses.courses[0];
        if(!existingCourse.totalBFinal || !existingCourse.midterm || !existingCourse.oral
            || !existingCourse.practical || !existingCourse.attendance
        ) throw new ConflictException('Please update other results before final first')
        const existingTotalBFinal = existingCourse.totalBFinal;
        // Update the oral and recalculate total
        const studentCoursesResult = await this.studentCourseModel.findOneAndUpdate(
            { studentId: params.studentId, "courses.courseId": body.courseId },
            { $set: {
                    "courses.$.updatedBy": req.authTeacher.id, "courses.$.final": body.final,
                    "courses.$.totalAFinal": (existingTotalBFinal) + body.final }
            }, { new: true }
        ).select('studentId courses')
        .populate({ path: 'studentId', select: 'fullName grade classNum'})
        .populate({ path: 'courses.updatedBy', select: 'name'});
        return studentCoursesResult
    }

}
