import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AdminModule, TeacherModule, StudentModule, ParentModule, CourseModule, ParentAuthModule } from './modules';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AdminModule,
    TeacherModule,
    StudentModule,
    CourseModule,
    ParentModule,
    ParentAuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
