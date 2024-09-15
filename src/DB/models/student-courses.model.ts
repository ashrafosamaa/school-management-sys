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
            oral: { type: String, default: "0", max: "10" },
            attendance: { type: String, default: "0", max:"10" },
            practical: { type: String, default: "0", max:"15" },
            midterm: { type: String, default: "0", max: "15" },
            final: { type: String, default:"0", max: "50" },
            courseId: { type: Types.ObjectId, ref: 'Course' },
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
        courseId: Types.ObjectId
    }>;

}

export const studentCourseSchema = SchemaFactory.createForClass(StudentCourse)
