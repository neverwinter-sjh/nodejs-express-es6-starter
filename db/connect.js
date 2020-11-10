import Mongoose from 'mongoose';
import { logger } from '../utils/logger';
import config from '../config.dev';

Mongoose.Promise = global.Promise;

const connectToDb = async () => {
  const RETRY_TIMEOUT = 3000;
  const dbHost = config.dbHost;
  const dbPort = config.dbPort;
  const dbName = config.dbName;
  const dbUserName = config.dbUserName;
  const dbPassword = config.dbPassword;
  const dbUrl = `mongodb://${dbUserName}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

  Mongoose.Promise = global.Promise;
  const options = {
    autoReconnect: true,
    useMongoClient: true,
    keepAlive: 30000,
    reconnectInterval: RETRY_TIMEOUT,
    reconnectTries: 10000
  };

  let isConnectedBefore = false;

  const connect = function () {
    return Mongoose.connect(dbUrl, options).catch(err => console.error('Mongoose connect failed with err: ', err));
  };

  connect();

  Mongoose.connection.on('error', function (e) {
    logger.error('Could not connect to MongoDB');
    logger.error(e);
  });

  Mongoose.connection.on('disconnected', function () {
    logger.error('Lost MongoDB connection...');
    if (!isConnectedBefore) {
      setTimeout(() => connect(), RETRY_TIMEOUT);
    }
  });
  Mongoose.connection.on('connected', function () {
    isConnectedBefore = true;
    logger.info('Connection established to MongoDB');
  });

  Mongoose.connection.on('reconnected', function () {
    logger.info('Reconnected to MongoDB');
  });

  // Close the Mongoose connection, when receiving SIGINT
  process.on('SIGINT', function () {
    Mongoose.connection.close(function () {
      logger.warn('Force to close the MongoDB connection after SIGINT');
      process.exit(0);
    });
  });
};

export default connectToDb;
