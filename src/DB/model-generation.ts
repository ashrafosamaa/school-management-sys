import { MongooseModule } from "@nestjs/mongoose";
import { Admin, adminSchema } from "./models/admin.model";


export const models = MongooseModule.forFeature([
    {name : Admin.name , schema : adminSchema}
])
