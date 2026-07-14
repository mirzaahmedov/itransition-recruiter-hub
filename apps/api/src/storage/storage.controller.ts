import { Controller, Get, Param, Res } from '@nestjs/common';
import { StorageService } from './storage.service';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Get(':key')
  async getImage(@Param('key') key: string, @Res() res: Response) {
    const file = await this.storageService.client.send(
      new GetObjectCommand({
        Key: 'images/' + key,
        Bucket: process.env.S3_BUCKET,
      }),
    );

    res.setHeader('Content-Type', file.ContentType ?? 'image/jpeg');

    (file.Body as Readable).pipe(res);
  }
}
