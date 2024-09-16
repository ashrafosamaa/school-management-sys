import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({timestamps : true})
export class StudentCourse {
    @Prop({ type : Types.ObjectId , ref : 'Student' , required : true , })
    studentId : Types.ObjectId

    @Prop({
        type: [{
            title: { type: String, },
            year: { type: String, },
            term: { type: String, enum: ['first', 'second', 'summer'] },
            oral: { type: Number, min:0 , max: 10 },
            attendance: { type: Number, min:0 , max:10 },
            practical: { type: Number, min:0 , max:15 },
            midterm: { type: Number, min:0 , max: 15 },
            totalBFinal: { type: Number, min:0 , max: 50 },
            final: { type: Number, min:0 , max: 50 },
            totalAFinal: { type: Number, min:0 , max: 100 },
            courseId: { type: Types.ObjectId, ref: 'Course' },
            updatedBy :{ type: Types.ObjectId, ref: 'Teacher' }, 
        }], required: true
    })
    courses: Array<{
        title: string;
        year: string;
        term: string;
        oral: number;
        attendance: number;
        practical: number;
        midterm: number;
        final: number;
        totalBFinal: number;
        totalAFinal: number;
        courseId: Types.ObjectId,
        updatedBy : Types.ObjectId
    }>;

}

export const studentCourseSchema = SchemaFactory.createForClass(StudentCourse)
