import { Module } from '@nestjs/common';
import { UserAttributeService } from './user-attribute.service';
import { UserAttributeController } from './user-attribute.controller';

@Module({
  controllers: [UserAttributeController],
  providers: [UserAttributeService],
})
export class UserAttributeModule {}
