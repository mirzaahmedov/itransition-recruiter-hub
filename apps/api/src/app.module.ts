import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AttributeModule } from './attribute/attribute.module';
import { PositionModule } from './position/position.module';
import { CategoryModule } from './category/category.module';
import { UserAttributeModule } from './user/attribute/user-attribute.module';
import { ProjectModule } from './user/project/project.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { StorageModule } from './storage/storage.module';
import { ResumeModule } from './position/resume/resume.module';
import { UserResumeModule } from './resume/resume.module';
import { ResumeAttributeModule } from './resume-attribute/resume-attribute.module';
import { AllExceptionsFilter } from './models/all-exceptions.filter';

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
    UserAttributeModule,
    ProjectModule,
    CategoryModule,
    AttributeModule,
    PositionModule,
    StorageModule,
    ResumeModule,
    UserResumeModule,
    ResumeAttributeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
