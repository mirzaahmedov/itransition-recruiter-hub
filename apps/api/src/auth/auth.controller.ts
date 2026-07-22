import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { IGoogleUser } from './strategies/google.strategy';
import { AuthUser } from './decorators/auth-user.decorator';
import type { User } from '@rh/database/client';
import { makeResponse } from '@/models/api';
import { LoginUserDto, RegisterUserDto } from './auth.dto';
import bcrypt from 'bcryptjs';
import { IGithubUser } from './strategies/github.strategy';

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

    if (!user.googleId) {
      throw new ForbiddenException(
        'User was not registered using google oauth',
      );
    }

    res.redirect(
      `${process.env.WEB_HOST}/auth/oauth/callback?accessToken=${accessToken}&userRole=${user.role}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, user } = await this.authService.githubLogin(
      req.user as IGithubUser,
    );

    if (!user.githubId) {
      throw new ForbiddenException(
        'User was not registered using github oauth',
      );
    }

    res.redirect(
      `${process.env.WEB_HOST}/auth/oauth/callback?accessToken=${accessToken}&userRole=${user.role}`,
    );
  }

  @Post('register')
  async register(@Body() data: RegisterUserDto) {
    const encryptedPassword = bcrypt.hashSync(data.password, 10);

    const { accessToken, user } = await this.authService.register({
      name: data.name,
      email: data.email,
      password: encryptedPassword,
    });

    user.password = null;

    return makeResponse({ accessToken, user });
  }

  @Post('login')
  async login(@Body() data: LoginUserDto) {
    const user = await this.authService.login(data.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new UnauthorizedException('Account exists without a password');
    }

    if (!bcrypt.compareSync(data.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.authService.signToken(user.id, user.email);
    user.password = null;

    return makeResponse({ accessToken, user });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@AuthUser() user: User) {
    return makeResponse(user);
  }
}
