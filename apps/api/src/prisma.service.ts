import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, createPrismaAdapter } from '@rh/core';
import fs from 'fs';
import path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = createPrismaAdapter({
      ca: fs
        .readFileSync(path.resolve(process.cwd(), 'certs', 'ca.pem'))
        .toString(),
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
