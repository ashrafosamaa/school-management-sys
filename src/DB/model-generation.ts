import { MongooseModule } from "@nestjs/mongoose";
import { Admin, adminSchema } from "./models/admin.model";
import { Teacher, teacherSchema } from "./models/teacher.model";


export const models = MongooseModule.forFeature([
    {name : Admin.name , schema : adminSchema},
    {name : Teacher.name , schema : teacherSchema}
])
