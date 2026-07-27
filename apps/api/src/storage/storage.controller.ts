import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Get(':key')
  async getByKey(@Param('key') key: string, @Res() res: Response) {
    const file = await this.storageService.read(`images/${key}`);

    res.setHeader('Content-Type', file.ContentType ?? 'image/jpeg');

    (file.Body as Readable).pipe(res);
  }
}
