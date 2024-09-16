import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from 'src/common/send-email.service';
import { models } from 'src/DB/model-generation';
import { ParentAuthController } from 'src/parent-auth/parent-auth.controller';
import { ParentAuthService } from 'src/parent-auth/parent-auth.service';


@Module({
    imports: [models],
    controllers: [ParentAuthController],
    providers: [ParentAuthService, JwtService, SendEmailService],
})
export class ParentModule {}
