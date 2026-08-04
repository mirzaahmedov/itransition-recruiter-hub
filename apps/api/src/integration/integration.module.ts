import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { PositionModule } from '@/position/position.module';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { UserService } from '@/user/user.service';

@Module({
  imports: [PositionModule],
  controllers: [IntegrationController],
  providers: [IntegrationService, SalesforceService, UserService],
})
export class IntegrationModule {}
