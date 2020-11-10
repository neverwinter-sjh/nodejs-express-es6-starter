import path from 'path';

let config = {};

config.logFileDir = path.join(__dirname, './log');
config.logFileName = 'app.log';
config.dbHost = process.env.dbHost || 'localhost';
config.dbPort = process.env.dbPort || '16010';
config.dbName = process.env.dbName || 'MEMBERS';
config.dbUserName = process.env.dbUserName || 'super_admin';
config.dbPassword = process.env.dbPassword || '1234';
config.serverPort = process.env.serverPort || 8080;
config.TOKEN_SECRET = 'sdflkjqwelkjqwlekj123lkjqwelknasd';

if (process.env.NODE_ENV === 'production') {
  // config.dbHost =
}

export default config;
