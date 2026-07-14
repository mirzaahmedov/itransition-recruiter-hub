import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from '@/user/user.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
