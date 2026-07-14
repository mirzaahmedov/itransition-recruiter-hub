import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StorageService } from '@/storage/storage.service';

@Module({
  providers: [UserService, StorageService],
  controllers: [UserController],
})
export class UserModule {}
