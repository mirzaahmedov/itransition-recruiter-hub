import path from 'path';

export function parseObjectKeyFromImageURL(url: string) {
  const filename = path.basename(url);
  const ext = path.extname(filename);
  const key = filename.replace(ext, '');
  return key;
}
