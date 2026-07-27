import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User, UserRole } from '@rh/database/client';
import { ResumeLikeService } from './resume-like.service';

@Controller(`resumes/:resumeId/likes`)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.RECRUITER)
export class ResumeLikeController {
  constructor(private readonly resumeLikeService: ResumeLikeService) {}

  @Post()
  create(@Param('resumeId') resumeId: string, @AuthUser() user: User) {
    return this.resumeLikeService.create({
      resumeId,
      userId: user.id,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() user: User) {
    return this.resumeLikeService.findOne({
      id,
      userId: user.id,
    });
  }

  @Delete()
  remove(@Param('resumeId') resumeId: string, @AuthUser() user: User) {
    return this.resumeLikeService.remove({
      resumeId,
      userId: user.id,
    });
  }
}
