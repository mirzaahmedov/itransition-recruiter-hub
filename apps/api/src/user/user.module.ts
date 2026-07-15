import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StorageService } from '@/storage/storage.service';
import { UserProfileService } from '@/profile/profile.service';

@Module({
  providers: [UserService, UserProfileService, StorageService],
  controllers: [UserController],
})
export class UserModule {}
