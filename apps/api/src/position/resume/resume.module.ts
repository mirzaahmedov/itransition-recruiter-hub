import { UserAttributeService } from '@/user/attribute/user-attribute.service';
import { Module } from '@nestjs/common';
import { PositionService } from '../position.service';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, UserAttributeService, PositionService],
  exports: [ResumeService],
})
export class ResumeModule {}
