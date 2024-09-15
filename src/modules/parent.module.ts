import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from 'src/common/send-email.service';
import { models } from 'src/DB/model-generation';
import { ParentController } from 'src/parent/parent.controller';
import { ParentService } from 'src/parent/parent.service';


@Module({
    imports: [models],
    controllers: [ParentController],
    providers: [ParentService, JwtService, SendEmailService],
})
export class ParentModule {}
