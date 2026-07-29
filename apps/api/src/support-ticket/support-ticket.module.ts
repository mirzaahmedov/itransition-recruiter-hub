import { Module } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketController } from './support-ticket.controller';
import { DropboxService } from '@/dropbox/dropbox.service';

@Module({
  controllers: [SupportTicketController],
  providers: [SupportTicketService, DropboxService],
})
export class SupportTicketModule {}
