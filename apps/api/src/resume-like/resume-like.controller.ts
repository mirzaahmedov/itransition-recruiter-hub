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
import { ResumeLikeService } from './resume-like.service';
import { CreateResumeLikeDto } from './dto/create-resume-like.dto';
import { UpdateResumeLikeDto } from './dto/update-resume-like.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User, UserRole } from '@rh/database/client';
import { Roles } from '@/auth/decorators/roles.decorator';

@Controller(`resumes/:resumeId`)
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

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.resumeLikeService.remove({
      id,
      userId: user.id,
    });
  }
}
