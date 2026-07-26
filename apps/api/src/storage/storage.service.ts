import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
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

  async upload(key: string, file: Express.Multer.File) {
    return await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `images/${key}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
  }

  async delete(key: string) {
    return await this.client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `images/${key}`,
      }),
    );
  }
}
