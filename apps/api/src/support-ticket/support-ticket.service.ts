import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSupportTicketPayload } from '@rh/shared';
import { User, UserRole } from '@rh/database/client';
import { DropboxService } from '@/dropbox/dropbox.service';
import { SupportTicketFileContentsSchema } from '@rh/shared/schemas';
import { SupportTicketFileContentsDto } from './support-ticket.dto';

@Injectable()
export class SupportTicketService {
  constructor(
    readonly prisma: PrismaService,
    readonly dbx: DropboxService,
  ) {}

  async create(user: User, data: CreateSupportTicketPayload) {
    const adminEmails = (
      await this.prisma.user.findMany({
        select: {
          email: true,
        },
        where: {
          role: UserRole.ADMINISTRATOR,
        },
      })
    ).map(({ email }) => email);

    const contents: SupportTicketFileContentsDto = {
      userId: user.id,
      userRole: user.role,
      title: data.title,
      link: data.link,
      priority: data.priority,
      positionId: data.positionId,
      emails: adminEmails,
    };

    const validResult = SupportTicketFileContentsSchema.safeParse(contents);
    if (!validResult.success) {
      console.log(validResult.error);
      throw new BadRequestException();
    }

    const path = `/support-ticket/${user.id}-${new Date().toISOString()}.json`;
    try {
      return await this.dbx.uploadFile(
        path,
        new Blob([JSON.stringify(validResult.data)], { type: 'text/plain' }),
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
