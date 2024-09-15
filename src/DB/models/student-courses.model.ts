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
            oral: { type: Number, default:0 , max: 10 },
            attendance: { type: Number, default:0 , max:10 },
            practical: { type: Number, default:0 , max:15 },
            midterm: { type: Number, default:0 , max: 15 },
            final: { type: Number, default:0 , max: 50 },
            total: { type: Number, default:0 , max: 100 },
            courseId: { type: Types.ObjectId, ref: 'Course' },
            updatedBy :{ type: Types.ObjectId, ref: 'Teacher' }, 
        }], required: true
    })
    courses: Array<{
        title: string;
        year: string;
        term: string;
        oral: string;
        attendance: string;
        practical: string;
        midterm: string;
        final: string;
        courseId: Types.ObjectId, 
        updatedBy : Types.ObjectId
    }>;

}

export const studentCourseSchema = SchemaFactory.createForClass(StudentCourse)
