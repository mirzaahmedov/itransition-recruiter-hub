import { Request } from 'express';
import path from 'path';

export function parseObjectKeyFromImageURL(url: string) {
  const filename = path.basename(url);
  const ext = path.extname(filename);
  const key = filename.replace(ext, '');
  return key;
}

export function buildStorageImageURL(req: Request, key: string) {
  const baseUrl = `${req.protocol}://${req.headers.host}`;
  const imageUrl = `${baseUrl}/storage/${key}`;
  return imageUrl;
}
