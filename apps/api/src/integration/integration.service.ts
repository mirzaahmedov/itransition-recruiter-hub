import { PositionService } from '@/position/position.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationService {
  constructor(private readonly positionService: PositionService) {}

  async getAggregatePositionData(positionId: string) {
    const position = await this.positionService.findOne({ id: positionId });
    return position;
  }
}
