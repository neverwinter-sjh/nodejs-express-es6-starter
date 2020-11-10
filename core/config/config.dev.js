import path from 'path';

let config = {};

config.logFileDir = path.join(__dirname, '../../log');
config.logFileName = 'app.log';
config.dbHost = process.env.dbHost || 'localhost';
config.dbPort = process.env.dbPort || '27017';
config.dbName = process.env.dbName || 'dbName';
config.serverPort = process.env.serverPort || 3000;
config.TOKEN_SECRET = 'weroiusdf34werljk90123sdlfkjsr1653qwea';
config.ADMIN_TOKEN_SECRET = 'Jrqwlekj#$kjwer#)(234wK_er';

export default config;
