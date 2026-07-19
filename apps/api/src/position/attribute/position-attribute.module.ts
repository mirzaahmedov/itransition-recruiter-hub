import { Module } from '@nestjs/common';
import { PositionAttributeService } from './position-attribute.service';
import { PositionAttributeController } from './position-attribute.controller';

@Module({
  controllers: [PositionAttributeController],
  providers: [PositionAttributeService],
})
export class PositionAttributeModule {}
