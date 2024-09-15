import { MongooseModule } from "@nestjs/mongoose";
import { Admin, adminSchema } from "./models/admin.model";
import { Teacher, teacherSchema } from "./models/teacher.model";
import { Student, studentSchema } from "./models/student.model";
import { Parent, parentSchema } from "./models/parent.model";


export const models = MongooseModule.forFeature([
    {name : Admin.name , schema : adminSchema},
    {name : Teacher.name , schema : teacherSchema},
    {name : Student.name, schema : studentSchema},
    {name : Parent.name , schema : parentSchema}
])
