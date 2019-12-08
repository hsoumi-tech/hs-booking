import mongoose from 'mongoose';

import { dbUrl } from './helper';
import logger from './logger';

mongoose.connection.on('connected', () => {
  logger.info(`Database successfully connected to ${dbUrl}`);
});

mongoose.connection.on('reconnected', () => {
  logger.info(`Database successfully reconnected to ${dbUrl}`);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Connection Disconnected');
});

mongoose.connection.on('close', () => {
  logger.info('Connection Closed');
});

mongoose.connection.on('error', error => {
  logger.error(error);
});

const run = async () => {
  await mongoose.connect(dbUrl, {
    autoReconnect: true,
    reconnectTries: 1000000,
    reconnectInterval: 3000
  });
};

run();
