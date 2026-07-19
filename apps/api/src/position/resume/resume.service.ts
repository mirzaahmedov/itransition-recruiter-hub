import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UserAttributeService } from '@/user/attribute/user-attribute.service';
import { PositionService } from '../position.service';
import { ResumeAttributeCreateInput } from '@rh/database/models';

@Injectable()
export class ResumeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userAttributeService: UserAttributeService,
    private readonly positionService: PositionService,
  ) {}

  async create(data: CreateResumeDto) {
    const userAttributes = await this.userAttributeService.findByUserId(
      data.userId,
    );
    const positionAttributes = await this.positionService.findOne(
      data.positionId,
    );

    const resume = await this.prisma.resume.create({
      data: {
        positionId: data.positionId,
        userId: data.userId,
        resumeAttributes: {
          create: positionAttributes.attributes.map((pa) => {
            const found = userAttributes.find(
              (ua) => ua.attributeId === pa.attributeId,
            );
            return {
              positionAttribute: {
                connect: {
                  id: pa.id,
                },
              },
              userAttribute: found
                ? {
                    connect: {
                      id: found.id,
                    },
                  }
                : {
                    create: {
                      userId: data.userId,
                      attributeId: pa.attributeId,
                    },
                  },
            };
          }),
        },
      },
    });

    return resume;
  }

  async findAll() {
    return await this.prisma.resume.findMany({
      include: {
        resumeAttributes: {
          include: {
            userAttribute: {
              include: {
                attribute: true,
                choice: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} resume`;
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }
}
