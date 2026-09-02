const { createExpressServer } = require('../dist/main');

let cachedServer;

module.exports = async (req, res) => {
  try {
    if (!cachedServer) {
      cachedServer = await createExpressServer();
    }

    return cachedServer(req, res);
  } catch (error) {
    console.error('SkillSwap API bootstrap failed', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        message: 'API failed to start',
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }
};
