import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User, UserRole } from '@rh/database/client';
import { makeResponse } from '@rh/shared/models';
import { ResumeService } from '@/position/resume/resume.service';
import { ResumeLikeService } from '@/resume-like/resume-like.service';

@Controller('resumes')
@UseGuards(AuthGuard('jwt'))
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly resumeLikeService: ResumeLikeService,
  ) {}

  @Get()
  async findAll(@AuthUser() user: User) {
    if (user.role === UserRole.CANDIDATE) {
      return makeResponse(await this.resumeService.findAllByUser(user.id));
    } else {
      return makeResponse(await this.resumeService.findAllPublished());
    }
  }

  @Get('likes')
  async findResumeLikes(@AuthUser() user: User) {
    return makeResponse(await this.resumeLikeService.findAll(user.id));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @AuthUser() user: User) {
    return makeResponse(await this.resumeService.findOne(id, user));
  }
}
