import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parent } from 'src/DB/models/parent.model';
import { Student } from 'src/DB/models/student.model';
import { APIFeatures } from 'src/utils/api-feature';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { StudentCourse } from 'src/DB/models/student-courses.model';


@Injectable()
export class ParentService {
    constructor(
        @InjectModel(Parent.name) private parentModel: Model<Parent>,
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(StudentCourse.name) private studentCourseModel: Model<StudentCourse>,
        private jwtService: JwtService
    ) {}

    async getAllParents(query: any) {
        const { page, size, sort } = query
        const features = new APIFeatures(query, this.parentModel.find({ isAccountActivated: true })
            .select(' name email phone '))
            .pagination({ page, size })
            .sort(sort)
        const parents = await features.mongooseQuery
        if(!parents.length) throw new ConflictException('No parents found')
        return parents
    }

    async getParent(params: any) {
        const parent = await this.parentModel.findOne({ _id: params.parentId, isAccountActivated: true })
            .select(' name email phone address parentSons ')
            .populate({ path: 'parentSons', select: 'fullName nationalId grade classNum' })
        if(!parent) throw new ConflictException('Parent not found')
        return parent
    }

    async searchParent(query: any) {
        const { ...search } = query
        const features = new APIFeatures(query, this.parentModel.find()
            .select(' name email phone address parentSons ')
            .populate({ path: 'parentSons', select: 'fullName nationalId grade classNum' }))
            .searchParent(search)
        const parents = await features.mongooseQuery
        if(!parents.length) throw new ConflictException('No parents found')
        return parents
    }

    async updateParentAcc(body: any, params: any) {
        const parent = await this.parentModel.findById(params.parentId)
        if(!parent) throw new ConflictException('Parent not found')
        const isPhoneExist = await this.parentModel.findOne({ phone: body.phone, _id: {$ne: params.parentId} })
        if(isPhoneExist) throw new ConflictException('Phone number already exists')
        if(body.name) parent.name = body.name
        if(body.phone) parent.phone = body.phone
        if(body.address) parent.address = body.address
        await parent.save()
        return true
    }

    async deleteParentAcc(params: any) {
        const parent = await this.parentModel.findByIdAndDelete(params.parentId)
        if(!parent) throw new ConflictException('Parent not found')
        return true
    }

    async getMyAcc(req: any) {
        const parent = await this.parentModel.findById(req.authParent.id)
            .select(' name email phone address parentSons ')
            .populate({ path: 'parentSons', select: 'fullName nationalId grade classNum' })
        return parent
    }

    async addNewSon(body: any, req: any) {
        const studentExist = await this.studentModel.findOne({nationalId : body.stNationalId})
        if(!studentExist) throw new ConflictException('National ID of student not found')
        const parent = await this.parentModel.findById(req.authParent.id)
        const sonExists = parent.parentSons.some(c => c.stNationalId.toString() === body.stNationalId);
        if (sonExists) throw new ConflictException('Son already added')
        const finalParent = await this.parentModel.findOneAndUpdate({ _id: req.authParent.id },
            { $addToSet: { parentSons: { fullName: studentExist.fullName, stNationalId: body.stNationalId, studentId: studentExist._id }}},
            { new: true }).select(' name email phone address parentSons ')
            .populate({ path: 'parentSons', select: 'fullName nationalId grade classNum' })
        await parent.save()
        return finalParent
    }

    async deleteSon(body: any, req: any) {
        const parent = await this.parentModel.findById(req.authParent.id)
        const sonExists = parent.parentSons.some(c => c.stNationalId.toString() === body.stNationalId);
        if (!sonExists) throw new ConflictException('Son not found in your list')
        // check that this is not last son
        if (parent.parentSons.length === 1) throw new BadRequestException('Last son cannot be deleted, you could delete your account instead')
        const finalParent = await this.parentModel.findOneAndUpdate({ _id: req.authParent.id },
            { $pull: { parentSons: { stNationalId: body.stNationalId }}},
            { new: true }).select(' name email phone address parentSons ')
            .populate({ path: 'parentSons', select: 'fullName nationalId grade classNum' })
        await parent.save()
        return finalParent
    }

    async updateMyAcc(body: any, req: any) {
        const parent = await this.parentModel.findById(req.authParent.id)
        const isPhone = await this.parentModel.findOne({phone: body.phone, _id: {$ne: req.authParent.id}})
        if(isPhone) throw new ConflictException('Phone number already in use')
        if(body.name) parent.name = body.name
        if(body.phone) parent.phone = body.phone
        if(body.address) parent.address = body.address
        await parent.save()
        return true
    }

    async updateMyPassword(body: any, req: any) {
        const parent = await this.parentModel.findById(req.authParent.id)
        const { oldPassword, newPassword } = body
        if(!bcrypt.compareSync(oldPassword, parent.password)) throw new BadRequestException('Invalid old password')
        const hashPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS_1)
        parent.password = hashPassword
        await parent.save()
        const parentToken = this.jwtService.sign({ id: parent._id, name: parent.name, eamil: parent.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return parentToken
    }

    async deleteMyAcc(req: any) {
        const parent = await this.parentModel.findById(req.authParent.id)
        await parent.deleteOne()
        return true
    }

    async getStudentCoursesByParent(params: any) {
        const student = await this.studentCourseModel.findOne({studentId: params.studentId})
            .select('studentId courses')
            .populate({ path: 'studentId', select: 'fullName grade classNum'})
            .populate({ path: 'courses.updatedBy', select: 'name'});
        if(!student) throw new ConflictException('Student has no courses added yet')
        return student
    }

}
