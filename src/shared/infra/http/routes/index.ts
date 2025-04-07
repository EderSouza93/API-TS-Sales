import uploadConfig from '@config/upload';
import customersRouter from '@modules/customers/infra/http/routes/CustomerRoutes';
import ordersRouter from '@modules/orders/infra/http/routes/OrdersRoutes';
import productsRouter from '@modules/products/infra/http/routes/ProductRoutes';
import avatarRouter from '@modules/users/infra/http/routes/AvatarRoutes';
import passwordRouter from '@modules/users/infra/http/routes/PasswordRoutes';
import profileRouter from '@modules/users/infra/http/routes/ProfileRoutes';
import sessionsRouter from '@modules/users/infra/http/routes/SessionRoutes';
import usersRouter from '@modules/users/infra/http/routes/UserRoutes';

import express, { Router, Request, Response } from 'express';

const routes = Router();

routes.get('/health', (_request: Request, response: Response) => {
  response.json({ message: 'Hello Dev! I am Alive! ' });
});
routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/avatar', avatarRouter);
routes.use('/files', express.static(uploadConfig.directory));
routes.use('/passwords', passwordRouter);
routes.use('/profiles', profileRouter);
routes.use('/customers', customersRouter);
routes.use('/orders', ordersRouter);

export default routes;
