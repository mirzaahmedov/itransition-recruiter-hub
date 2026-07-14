import { S3Client } from '@aws-sdk/client-s3';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class StorageService implements OnModuleInit {
  client!: S3Client;

  onModuleInit() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: process.env.S3_HOST,
      credentials: {
        accessKeyId: process.env.S3_ID,
        secretAccessKey: process.env.S3_KEY,
      },
    });
  }
}
