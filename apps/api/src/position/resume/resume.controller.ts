import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User, ResumeStatus, UserRole } from '@rh/database/client';
import { AuthGuard } from '@nestjs/passport';
import { makeResponse } from '@/models/api';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';

@Controller('positions/:positionId/resumes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @Roles(UserRole.CANDIDATE)
  async create(
    @AuthUser() user: User,
    @Param('positionId') positionId: string,
  ) {
    const existing = await this.resumeService.findOneByUserAndPosition(
      user.id,
      positionId,
    );
    if (existing) {
      throw new ConflictException('You have already applied to this position');
    }

    return makeResponse(
      await this.resumeService.create({ userId: user.id, positionId }),
    );
  }

  @Get()
  async findAll(
    @AuthUser() user: User,
    @Param('positionId') positionId: string,
  ) {
    return makeResponse(
      await this.resumeService.findAllByPosition(positionId, user),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return makeResponse(await this.resumeService.findOne(id));
  }

  @Post(':id/publish')
  @Roles(UserRole.CANDIDATE, UserRole.ADMINISTRATOR)
  async publish(@AuthUser() user: User, @Param('id') id: string) {
    return makeResponse(await this.resumeService.publish(id, user.id));
  }

  @Patch(':id')
  @Roles(UserRole.CANDIDATE, UserRole.ADMINISTRATOR)
  async update(@Param('id') id: string, @Body('status') status: ResumeStatus) {
    return makeResponse(await this.resumeService.updateStatus(id, status));
  }

  @Delete(':id')
  @Roles(UserRole.CANDIDATE, UserRole.ADMINISTRATOR)
  async remove(@Param('id') id: string) {
    return makeResponse(await this.resumeService.remove(id));
  }
}
