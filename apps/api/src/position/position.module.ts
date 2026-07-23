import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { ResumeService } from './resume/resume.service';
import { UserAttributeService } from '@/user/attribute/user-attribute.service';

@Module({
  controllers: [PositionController],
  providers: [PositionService, UserAttributeService, ResumeService],
})
export class PositionModule {}
