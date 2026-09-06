import { config } from '@users/config';
import { databaseConnection } from '@users/database';
import express, { Express } from 'express';
import { start } from '@users/server';

const initialize = (): void => {
  config.cloudinaryConfig();
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();
