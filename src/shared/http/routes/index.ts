import productsRouter from '@modules/products/routes/ProductRoutes';
import { Router, Request, Response } from 'express';

const routes = Router();

routes.get('/health', (_request: Request, response: Response) => {
  response.json({ message: 'Hello Dev! I am Alive! ' });
});
routes.use('/products', productsRouter);

export default routes;
