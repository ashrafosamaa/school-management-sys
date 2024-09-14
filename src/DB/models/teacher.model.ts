import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps : true})
export class Teacher {
    @Prop({
        type : String ,
        required : true ,
        trim : true
    })
    name : string

    @Prop({
        type : String ,
        required : true ,
        unique : true
    })
    email : string

    @Prop({
        type: String,
        required: true,
    })
    phone : string

    @Prop({
        type : String ,
        required : true
    })
    nationalId : string

    @Prop({
        type : String ,
        required : true ,
    })
    password : string

    @Prop({
        type : String ,
        required : true ,
        enum : ["english", "arabic", "maths", "science", "sports", "music"]
    })
    specialization : string

    @Prop({
        type : String ,
        required : true ,
        default : "teacher" ,
        enum : ["teacher"]
    })
    role : string

    @Prop({
        type : String ,
        required : true
    })
    salary : string

    @Prop({
        type : Boolean ,
        required : true ,
        default : false
    })
    isAccountActivated : boolean
}

export const teacherSchema = SchemaFactory.createForClass(Teacher)