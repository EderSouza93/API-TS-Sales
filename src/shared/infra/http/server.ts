/* eslint-disable no-console */
import 'reflect-metadata';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import '@shared/container';

import { AppDataSource } from '../typeorm/data-source';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import routes from './routes';
import ErrorHandleMiddleware from '@shared/infra/http/middlewares/ErrorHandleMiddleware';

const startServer = async () => {
  await AppDataSource.initialize();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(rateLimiter);
  app.use(routes);
  app.use(errors());
  app.use(
    (
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      ErrorHandleMiddleware.handleError(error, req, res, next);
    },
  );

  console.log('Connected to the database! 🎉');

  return app;
};

export default startServer()
  .then(app => {
    return app.listen(3333, () => {
      console.log('Server started on port 3333! 🏆');
    });
  })
  .catch(error => {
    console.log('Failed to connect to the server:', error);
  });
