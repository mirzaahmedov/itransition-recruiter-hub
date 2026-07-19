import { Module } from '@nestjs/common';
import { ResumeAttributeService } from './resume-attribute.service';
import { ResumeAttributeController } from './resume-attribute.controller';

@Module({
  controllers: [ResumeAttributeController],
  providers: [ResumeAttributeService],
})
export class ResumeAttributeModule {}
