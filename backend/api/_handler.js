let cachedServer;

function bootstrapTimeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          'API bootstrap timed out. On the Vercel API project set DATABASE_URL (Neon pooled), DB_SYNC=true, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, FRONTEND_ORIGIN.',
        ),
      );
    }, ms);
  });
}

module.exports = async (req, res) => {
  try {
    if (!cachedServer) {
      const { createExpressServer } = require('../_nest/main');
      cachedServer = await Promise.race([
        createExpressServer(),
        bootstrapTimeout(12000),
      ]);
    }

    const [pathname, search] = String(req.url || '/').split('?');
    if (pathname !== '/api' && !pathname.startsWith('/api/')) {
      const nextPath = pathname === '/' ? '/api' : `/api${pathname}`;
      req.url = search ? `${nextPath}?${search}` : nextPath;
    }

    cachedServer(req, res);
  } catch (error) {
    console.error('SkillSwap API bootstrap failed', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          message: 'API failed to start',
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  }
};
