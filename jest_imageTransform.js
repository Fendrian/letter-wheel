const path = require('path');
const createCacheKeyFunction = require('fbjs-scripts/jest/createCacheKeyFunction');

module.exports = {
  process: (_, filename) =>
    `module.exports = {
      testUri: ${JSON.stringify(path.normalize(path.relative(__dirname, filename))).replace(/\\\\/g, '/')}
    };`,
  getCacheKey: createCacheKeyFunction([__filename]),
};
