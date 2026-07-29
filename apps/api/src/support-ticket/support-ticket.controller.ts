import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@rh/database/client';
import { makeResponse } from '@rh/shared/models';
import { CreateSupportTicketDto } from './support-ticket.dto';
import { SupportTicketService } from './support-ticket.service';

@Controller('support-tickets')
@UseGuards(AuthGuard('jwt'))
export class SupportTicketController {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  @Post()
  async create(@AuthUser() user: User, @Body() data: CreateSupportTicketDto) {
    return makeResponse(await this.supportTicketService.create(user, data));
  }
}
