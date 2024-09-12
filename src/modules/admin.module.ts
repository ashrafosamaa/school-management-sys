import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminController } from 'src/admin/admin.controller';
import { AdminService } from 'src/admin/admin.service';
import { models } from 'src/DB/model-generation';


@Module({
  imports: [models],
  controllers: [AdminController],
  providers: [AdminService, JwtService]
})
export class AdminModule {}
