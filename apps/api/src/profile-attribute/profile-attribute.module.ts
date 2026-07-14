import { Module } from '@nestjs/common';
import { ProfileAttributeService } from './profile-attribute.service';
import { ProfileAttributeController } from './profile-attribute.controller';
import { ProfileService } from '@/profile/profile.service';

@Module({
  controllers: [ProfileAttributeController],
  providers: [ProfileAttributeService, ProfileService],
})
export class ProfileAttributeModule {}
