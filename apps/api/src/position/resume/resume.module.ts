import { UserAttributeService } from '@/user/attribute/user-attribute.service';
import { Module } from '@nestjs/common';
import { PositionService } from '../position.service';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { ProjectModule } from '@/user/project/project.module';

@Module({
  controllers: [ResumeController],
  imports: [ProjectModule],
  providers: [ResumeService, UserAttributeService, PositionService],
  exports: [ResumeService],
})
export class ResumeModule {}
