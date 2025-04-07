/* eslint-disable no-console */
import 'reflect-metadata';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import { AppDataSource } from '../typeorm/data-source';
import rateLimiter from '@shared/middlewares/rateLimiter';
import routes from './routes';
import ErrorHandleMiddleware from '@shared/middlewares/ErrorHandleMiddleware';

AppDataSource.initialize()
  .then(async () => {
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

    console.log('Connected to the database!');

    app.listen(3333, () => {
      console.log('Server started on port 3333! ');
    });
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error);
  });
