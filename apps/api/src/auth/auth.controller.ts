import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { IGoogleUser } from './strategies/google.strategy';
import { AuthUser } from './decorators/auth-user.decorator';
import type { User } from '@rh/core';
import { ok } from '@/models/api';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, user } = await this.authService.googleLogin(
      req.user as IGoogleUser,
    );
    res.redirect(
      `${process.env.WEB_HOST}/auth-success?accessToken=${accessToken}&userRole=${user.role}`,
    );
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@AuthUser() user: User) {
    return ok(user);
  }
}
