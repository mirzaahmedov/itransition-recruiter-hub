import { ok } from '@/models/api';
import { BulkIdsSchema } from '@/schemas/BulkUpdateSchema';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserUpdateRoleSchema } from './user.schema';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@rh/database/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.findMany();
    return ok(users);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getUserProfile(@AuthUser() user: User) {
    const profile = await this.userService.findUserProfile(user.id);
    return ok(profile);
  }

  @Patch('bulk-change-roles')
  async updateRoles(@Body() payload: unknown) {
    const PayloadSchema = UserUpdateRoleSchema.extend(BulkIdsSchema.shape);

    const result = PayloadSchema.safeParse(payload);
    if (!result.success) {
      return null;
    }

    const { ids, role } = result.data;
    await this.userService.bulkUpdateRoles(ids, role);
  }
}
