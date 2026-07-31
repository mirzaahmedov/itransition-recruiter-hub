import { createHash } from 'crypto';

export function hashString(rawString: string) {
  return createHash('sha256').update(rawString).digest('hex');
}
