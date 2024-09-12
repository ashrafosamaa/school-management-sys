import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps : true})
export class Admin {
    @Prop({
        type : String ,
        required : true ,
        trim : true
    })
    username : string

    @Prop({
        type : String ,
        required : true ,
        unique : true
    })
    nId : string

    @Prop({
        type : String ,
        required : true ,
    })
    password : string

    @Prop({
        type : String ,
        required : true ,
        default : "admin" ,
        enum : ["admin"]
    })
    role : string

}

export const adminSchema = SchemaFactory.createForClass(Admin)
