import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parent } from 'src/DB/models/parent.model';
import { Student } from 'src/DB/models/student.model';
import * as bcrypt from 'bcrypt'
import { SendEmailService } from 'src/common/send-email.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class ParentAuthService {
    constructor(
        @InjectModel(Parent.name) private parentModel : Model<Parent>,
        @InjectModel(Student.name) private studentModel : Model<Student>,
        private sendEmailService : SendEmailService,
        private jwtService : JwtService
    ) {}

    async signUp(body: any) {
        const isEmailExist = await this.parentModel.findOne({email : body.email})
        if(isEmailExist) throw new BadRequestException('Email already exists')
        const isPhoneExist = await this.parentModel.findOne({phone : body.phone})
        if(isPhoneExist) throw new BadRequestException('Phone already exists')
        const isNationalIdExist = await this.studentModel.findOne({nationalId : body.stNationalId})
        if(!isNationalIdExist) throw new BadRequestException('National ID of student not found')
        const hashPassword = bcrypt.hashSync(body.password, +process.env.SALT_ROUNDS_1)
        const activateCode = Math.floor(1000 + Math.random() * 9000).toString();
        const accountActivateCode = bcrypt.hashSync(activateCode, +process.env.SALT_ROUNDS_2)
        // send confirmation email
        try{
            await this.sendEmailService.sendEmail(
                body.email,
                "Verification Code (valid right now for you)",
                `Hi ${body.name},\nYour verification code is ${activateCode}.
                \nEnter this code to access our [website] to activate your account.
                \nWe’re glad you’re here!`,
            )
        }
        catch{
            throw new InternalServerErrorException(`Email not sent, please try again`);
        }
        const parent = await this.parentModel.create({ name : body.name, email : body.email, phone : body.phone,
            address : body.address, password : hashPassword,
            parentSons : [{
                fullName : isNationalIdExist.fullName,
                stNationalId : body.stNationalId,
                studentId : isNationalIdExist._id
            }],
            accountActivateCode
        })
        if(!parent) throw new InternalServerErrorException('Parent account not created please try again')
        return true
    }

    async confirmEmail(body: any) {
        const parent = await this.parentModel.findOne({email : body.email})
        if(!parent) throw new ConflictException('Email not found')
        // verify otp
        const checkCode = bcrypt.compareSync(body.activateCode , parent.accountActivateCode)
        // check if otp is valid
        if(!checkCode){
            throw new BadRequestException("Invalid verification code")
        }
        parent.accountActivateCode = null
        parent.isAccountActivated = true
        await parent.save()
        const parentToken = this.jwtService.sign({ id: parent._id, name: parent.name, email: parent.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return parentToken
    }

    async resendCode(body: any) {
        const parent = await this.parentModel.findOne({email : body.email})
        if(!parent) throw new ConflictException('Email not found')
        if(parent.isAccountActivated) throw new BadRequestException('Account already activated')
        const activateCode = Math.floor(1000 + Math.random() * 9000).toString();
        const accountActivateCode = bcrypt.hashSync(activateCode, +process.env.SALT_ROUNDS_2)
        parent.accountActivateCode = accountActivateCode
        await parent.save()
        try{
            await this.sendEmailService.sendEmail(
                parent.email,
                "Verification Code (valid right now for you)",
                `Hi ${parent.name},\nYour verification code is ${activateCode}.
                \nEnter this code to access our [website] to activate your account.
                \nWe’re glad you’re here!`,
            )
        }
        catch{
            throw new InternalServerErrorException(`Email not sent, please try again`);
        }
        return true
        
    }

    async login(body: any) {
        const parent = await this.parentModel.findOne({email : body.email})
        if(!parent) throw new ConflictException('Email not found')
        if(!parent.isAccountActivated) throw new BadRequestException
            ('Account not activated, check your email for verification code to activate your account')
        const checkPassword = bcrypt.compareSync(body.password, parent.password)
        if(!checkPassword) throw new BadRequestException('Invalid password')
        const parentToken = this.jwtService.sign({ id: parent._id, name: parent.name, email: parent.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return parentToken
    }

    async forgotPassword(body: any) {
        const parent = await this.parentModel.findOne({email : body.email})
        if(!parent) throw new ConflictException('Email not found')
        const resetPassCode = Math.floor(1000 + Math.random() * 9000).toString();
        const passwordResetCode = bcrypt.hashSync(resetPassCode, +process.env.SALT_ROUNDS_2)
        try{
            await this.sendEmailService.sendEmail(
                parent.email,
                "Password Reset Code (valid right now for you)",
                `Hi ${parent.name},\nThere was a request to change your password!\n
                If you did not make this request then please ignore this email.\n
                Otherwise, Please enter this code to change your password: ${resetPassCode}\n`,
            )
            parent.passwordResetCode = passwordResetCode
            await parent.save()
        }
        catch{
            parent.passwordResetCode = null
            await parent.save()
            throw new InternalServerErrorException(`Email not sent, please try again`);
        }
        return true
    }

    async verifyPasswordResetCode(body: any) {
        const parent = await this.parentModel.findOne({email : body.email})
        if(!parent) throw new ConflictException('Email not found')
        const checkCode = bcrypt.compareSync(body.resetCode , parent.passwordResetCode)
        // check if otp is valid
        if(!checkCode) throw new BadRequestException("Invalid verification code")
        parent.passwordResetReq = true
        await parent.save()
        return true
    }

    async resetPassword(body: any) {
        const parent = await this.parentModel.findOne({email : body.email})
        if(!parent) throw new ConflictException('Email not found')
        const hashPassword = bcrypt.hashSync(body.password, +process.env.SALT_ROUNDS_1)
        parent.password = hashPassword
        parent.passwordResetCode = null
        parent.passwordResetReq = false
        await parent.save()
        const parentToken = this.jwtService.sign({ id: parent._id, name: parent.name, email: parent.email },
            { secret: process.env.JWT_SECRET, expiresIn: "90d" })
        return parentToken
    }

}