import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@rh/database/client';
import { makeResponse } from '@/models/api';
import { ResumeService } from '@/position/resume/resume.service';

@Controller('resumes')
@UseGuards(AuthGuard('jwt'))
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  async findMine(@AuthUser() user: User) {
    return makeResponse(await this.resumeService.findAllByUser(user.id));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return makeResponse(await this.resumeService.findOne(id));
  }
}
