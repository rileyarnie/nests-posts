let dbConfig = {
  synchronize: true,
};

switch (process.env.NODE_ENV) {
  case 'development':
    dbConfig = {
      ...dbConfig,
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['**/*.entity.js'],
    };
    break;
  default:
    break;
}

module.exports = dbConfig;
