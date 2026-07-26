import { Module } from '@nestjs/common';
import { ResumeLikeService } from './resume-like.service';
import { ResumeLikeController } from './resume-like.controller';

@Module({
  controllers: [ResumeLikeController],
  providers: [ResumeLikeService],
})
export class ResumeLikeModule {}
