import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({timestamps : true})
export class Course {
    @Prop({ type : String , required : true , })
    title : string

    @Prop({ type: [Types.ObjectId], ref: 'Teacher', required: true })
    teachers: Types.ObjectId[]

    @Prop({ type: [String], required: true }) 
    grades: string[];

}

export const courseSchema = SchemaFactory.createForClass(Course)
