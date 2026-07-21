import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IGoogleUser } from './strategies/google.strategy';
import { UserRole } from '@rh/database/enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  signToken(userId: string, email: string) {
    return this.jwt.sign({ sub: userId, email });
  }

  async register(data: { name: string; email: string; password: string }) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: UserRole.CANDIDATE,
        },
      });

      const accessToken = this.signToken(user.id, user.email);

      return { accessToken, user };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

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

    const token = this.signToken(user.id, user.email);

    return {
      accessToken: token,
      user,
    };
  }
}
