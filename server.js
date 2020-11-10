import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { logger } from './utils/logger';
import morgan from 'morgan';
import config from './config.dev';
import connectToDb from './db/connect';
import userRouter from './routes/user';

const port = config.serverPort;

logger.stream = {
  write(message, encoding) {
    logger.info(message);
  }
};

console.log(process.env.NODE_ENV);

// connectToDb();

const corsOptions = {
  exposedHeaders: 'Auth-Token'
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev', { stream: logger.stream }));
app.use('/static', express.static('static'));
app.use('/user', userRouter);

// Index route
app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.listen(port, () => {
  logger.info('server started - ', port);
});
