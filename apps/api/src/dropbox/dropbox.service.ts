import { Injectable, OnModuleInit } from '@nestjs/common';
import { Dropbox } from 'dropbox';

@Injectable()
export class DropboxService implements OnModuleInit {
  private dbx!: Dropbox;

  async uploadFile(path: string, contents: Object | undefined) {
    await this.dbx.filesUpload({
      path,
      contents,
    });
  }

  onModuleInit() {
    this.dbx = new Dropbox({
      accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    });
  }
}
