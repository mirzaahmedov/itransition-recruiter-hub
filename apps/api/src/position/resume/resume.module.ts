import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { UserAttributeService } from '@/user/attribute/user-attribute.service';
import { PositionService } from '../position.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, UserAttributeService, PositionService],
  exports: [ResumeService],
})
export class ResumeModule {}
