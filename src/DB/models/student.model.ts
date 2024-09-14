import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps : true})
export class Student {
    @Prop({ type : String , required : true , trim : true })
    fullName : string

    @Prop({ type : String , required : true , unique : true })
    email : string

    @Prop({ type : String , required : true })
    nationalId : string

    @Prop({ type: String, })
    phone : string

    @Prop({ type: String, required: true, })
    parentPhone : string

    @Prop({ type : String , required : true })
    address : string

    @Prop({ type : String , required : true })
    birthDate : string

    @Prop({ type : String , required : true, enum : ["male", "female"] })
    gender : string

    @Prop({ type : String , required : true , })
    password : string

    @Prop({ type : String , required : true , })
    totalFees : string

    @Prop({ type : String , default : "0" })
    paidFees : string

    @Prop({ type : String , enum: ["paid", "unpaid"], default : "unpaid" })
    fessStatus : string

    @Prop({ type : String , required : true ,
    enum : ["kg1", "kg2", "first", "second", "third", "fouth", "fifth", "sixth", "seventh", "eighth", "ninth"] })
    grade : string

    @Prop({ type : String , required : true, enum : ["A", "B", "C"] })
    classNum : string

    @Prop({ type : String , default : "student" , enum : ["student"] })
    role : string

    @Prop({ type: {url: { type: String },
            publicId: { type: String }},
        })
    profileImg: {
        url: string;
        publicId: string;
    };

    @Prop({ type : String })
    folderId : string

    @Prop({ type : Boolean , default : false })
    isAccountActivated : boolean
}

export const studentSchema = SchemaFactory.createForClass(Student)
