const { createExpressServer } = require('../dist/main');

let cachedServer;

module.exports = async (req, res) => {
  if (!cachedServer) {
    cachedServer = await createExpressServer();
  }

  return cachedServer(req, res);
};
