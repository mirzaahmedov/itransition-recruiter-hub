import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AttributeCategoryModule } from './attribute-category/attribute-category.module';
import { AttributeModule } from './attribute/attribute.module';
import { AttributeChoiceModule } from './attribute-choice/attribute-choice.module';
import { PositionModule } from './position/position.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    AuthModule,
    UserModule,
    AttributeCategoryModule,
    AttributeModule,
    AttributeChoiceModule,
    PositionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
