import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StorageService } from '@/storage/storage.service';
import { ResumeService } from '@/position/resume/resume.service';
import { ResumeModule } from '@/position/resume/resume.module';

@Module({
  imports: [ResumeModule],
  providers: [UserService, StorageService],
  controllers: [UserController],
})
export class UserModule {}
