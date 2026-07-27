import { Controller, Get } from '@nestjs/common';
import { makeResponse } from '@rh/shared/models';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return makeResponse(await this.dashboardService.getStats());
  }

  @Get('positions/latest')
  async getLatestPositions() {
    return makeResponse(await this.dashboardService.getLatestPositions());
  }

  @Get('positions/popular')
  async getPopularPositions() {
    return makeResponse(await this.dashboardService.getPopularPositions());
  }
}
