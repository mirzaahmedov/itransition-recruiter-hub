import {
  Body,
  Controller,
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
import { UserRole, type User } from '@rh/database/client';
import { makeResponse } from '@/models/api';
import { LoginUserDto, RegisterUserDto } from './auth.dto';
import { UserService } from '@/user/user.service';
import bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

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

  @Post('register')
  async register(@Body() data: RegisterUserDto) {
    const ecryptedPassword = bcrypt.hashSync(data.password, 10);

    const user = await this.userService.create({
      name: data.name,
      email: data.email,
      password: ecryptedPassword,
      role: UserRole.CANDIDATE,
    });

    user.password = null;

    return makeResponse(user);
  }

  @Post('login')
  async login(@Body() data: LoginUserDto) {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new UnauthorizedException();
    }

    if (!bcrypt.compareSync(data.password, user.password)) {
      throw new UnauthorizedException();
    }

    user.password = null;

    return makeResponse(user);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@AuthUser() user: User) {
    return makeResponse(user);
  }
}
