const config = {
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
  logLevel: process.env.LOG_LEVEL || 'info',
};

module.exports = config;