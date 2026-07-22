import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User, ResumeStatus } from '@rh/database/client';
import { AuthGuard } from '@nestjs/passport';
import { makeResponse } from '@/models/api';

@Controller('positions/:positionId/resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @AuthUser() user: User,
    @Param('positionId') positionId: string,
  ) {
    return makeResponse(
      await this.resumeService.create({ userId: user.id, positionId }),
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @AuthUser() user: User,
    @Param('positionId') positionId: string,
  ) {
    return makeResponse(
      await this.resumeService.findAllByPosition(positionId, user),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    return makeResponse(await this.resumeService.findOne(id));
  }

  @Post(':id/publish')
  @UseGuards(AuthGuard('jwt'))
  async publish(@AuthUser() user: User, @Param('id') id: string) {
    return makeResponse(await this.resumeService.publish(id, user.id));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body('status') status: ResumeStatus) {
    return makeResponse(await this.resumeService.updateStatus(id, status));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    return makeResponse(await this.resumeService.remove(id));
  }
}
