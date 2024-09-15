import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({timestamps : true})
export class Parent {
    @Prop({ type : String , required : true , trim : true })
    name : string

    @Prop({ type : String , required : true , unique : true })
    email : string

    @Prop({ type: String, required: true, })
    phone : string

    @Prop({ type : String , required : true })
    address : string

    @Prop({ type : String , required : true , })
    password : string

    @Prop({ type : String , required : true , default : "parent" , enum : ["parent"] })
    role : string

    @Prop({
        type: [{
            fullName: { type: String, },
            stNationalId: { type: String, length: 14 },
            studentId: { type: Types.ObjectId, ref: 'Student'},
        }], required: true
    })
    parentSons: Array<{
        fullName: string;
        nationalId: string;
        studentId: Types.ObjectId;
    }>;

    @Prop({ type : Boolean , required : true , default : false })
    isAccountActivated : boolean

    @Prop({ type: String, })
    accountActivateCode : string

    @Prop({ type: String })
    passwordResetCode: string;

    @Prop({ type: Boolean, default: false })
    passwordResetReq: boolean;
}

export const parentSchema = SchemaFactory.createForClass(Parent)
