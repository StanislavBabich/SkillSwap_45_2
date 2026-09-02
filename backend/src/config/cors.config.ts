export function isAllowedOrigin(origin?: string): boolean {
  if (!origin) {
    return true;
  }

  const extra = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return extra.includes(origin) || origin.endsWith('.vercel.app');
}

export function nestCorsOrigin(
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
): void {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error('Not allowed by CORS'));
}
