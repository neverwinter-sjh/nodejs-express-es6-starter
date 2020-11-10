import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './core/logger/app-logger';
import morgan from 'morgan';
import config from './core/config/config.dev';
import connectToDb from './db/connect';
import userRouter from './routes/user';

const port = config.serverPort;
logger.stream = {
  write(message, encoding) {
    logger.info(message);
  },
};

connectToDb();

const corsOptions = {
  exposedHeaders: 'Auth-Token',
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev', { stream: logger.stream }));
app.use('/uploads', express.static('uploads'));
app.use('/user', userRouter);

// Index route
app.get('/', (req, res) => {
  res.send('Hello, API Server!');
});

app.listen(port, () => {
  logger.info('server started - ', port);
});
