import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IGoogleUser } from './strategies/google.strategy';
import { UserRole } from '@rh/core';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async googleLogin(googleUser: IGoogleUser) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          googleId: googleUser.googleId,
          role: UserRole.CANDIDATE,
        },
      });
    }

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken: token,
      user,
    };
  }
}
