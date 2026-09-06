import { Logger } from 'winston';
import { winstonLogger } from '@vsatya-kirankumar/jobber-shared';
import { config } from '@users/config';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'userDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.DATBASE_URL}`);
    log.info('User service successfully connected to mogo database.');
  } catch (error) {
    log.log('error', 'Userservice databaseConnection() method error.', error);
  }
};

export { databaseConnection };
