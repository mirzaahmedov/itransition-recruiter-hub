import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeModule as PositionResumeModule } from '@/position/resume/resume.module';
import { ResumeLikeService } from '@/resume-like/resume-like.service';

@Module({
  imports: [PositionResumeModule],
  providers: [ResumeLikeService],
  controllers: [ResumeController],
})
export class UserResumeModule {}
