import { mkdirSync } from 'fs';
import { join } from 'path';

export function getUploadsDir(): string {
  const dir = process.env.VERCEL
    ? join('/tmp', 'uploads')
    : join(process.cwd(), 'public', 'uploads');

  mkdirSync(dir, { recursive: true });
  return dir;
}
