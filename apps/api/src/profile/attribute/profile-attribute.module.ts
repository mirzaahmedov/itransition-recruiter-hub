import { Module } from '@nestjs/common';
import { ProfileAttributeService } from './profile-attribute.service';
import { ProfileAttributeController } from './profile-attribute.controller';
import { UserProfileService } from '@/profile/profile.service';

@Module({
  controllers: [ProfileAttributeController],
  providers: [ProfileAttributeService, UserProfileService],
})
export class ProfileAttributeModule {}
