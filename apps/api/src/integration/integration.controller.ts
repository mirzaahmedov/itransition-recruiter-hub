import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { makeResponse } from '@rh/shared/models';
import { PrismaService } from '@/prisma/prisma.service';
import { hashString } from '@/lib/hash';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { CreateSalesforceDto } from '@/salesforce/salesforce.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User, UserRole } from '@rh/database/client';
import { UserService } from '@/user/user.service';

@Controller('integration')
export class IntegrationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly integrationService: IntegrationService,
    private readonly salesforceService: SalesforceService,
  ) {}

  @Get('aggregate-position/:positionId')
  async getAggregatePositionData(
    @Param('positionId') positionId: string,
    @Headers('x-api-key') apiKey: string,
  ) {
    if (!apiKey) {
      throw new UnauthorizedException();
    }

    const apiKeyExists =
      await this.prisma.positionIntegrationApiKeys.findUnique({
        where: {
          hashToken: hashString(apiKey),
          positionId,
        },
      });

    if (!apiKeyExists) {
      throw new UnauthorizedException();
    }

    return makeResponse(
      await this.integrationService.getAggregatePositionData(positionId),
    );
  }

  @Post('salesforce/:userId')
  @UseGuards(AuthGuard('jwt'))
  async createSalesForceContact(
    @Param('userId') userId: string,
    @Body() data: CreateSalesforceDto,
    @AuthUser() user: User,
  ) {
    if (user.id !== userId && user.role !== UserRole.ADMINISTRATOR) {
      throw new ForbiddenException();
    }

    if (user.salesforceId) {
      throw new BadRequestException();
      return;
    }

    const result = await this.salesforceService.createContact(data);
    if (result.success) {
      this.userService.update(userId, {
        salesforceId: result.id,
      });
    }
  }
}
