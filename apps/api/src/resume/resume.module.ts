import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeModule as PositionResumeModule } from '@/position/resume/resume.module';

@Module({
  imports: [PositionResumeModule],
  controllers: [ResumeController],
})
export class UserResumeModule {}
