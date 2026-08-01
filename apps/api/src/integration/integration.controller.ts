import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { makeResponse } from '@rh/shared/models';
import { PrismaService } from '@/prisma/prisma.service';
import { hashString } from '@/lib/hash';
import { Request } from 'express';

@Controller('integration')
export class IntegrationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrationService: IntegrationService,
  ) {}

  @Get('aggregate-position/:positionId')
  async getAggregatePositionData(
    @Param('positionId') positionId: string,
    @Headers('x-api-key') apiKey: string,
    @Req() req: Request,
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
}
