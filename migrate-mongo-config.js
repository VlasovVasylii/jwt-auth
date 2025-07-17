// In this file you can configure migrate-mongo

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'server/.env') });

const config = {
  mongodb: {
    // url и databaseName теперь берутся из .env
    url: process.env.DB_URL,
    databaseName: process.env.DB_NAME || undefined,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
