import { Router } from 'express';
import OrderController from '../controllers/OrdersControllers';
import AuthMiddleware from '@shared/middlewares/authMiddleware';
import { idParamsValidation } from '@modules/products/infra/http/schemas/ProductSchemas';
import { createOrderValidate } from '../schemas/OrdersSchemas';

const ordersRouter = Router();
const ordersController = new OrderController();

ordersRouter.use(AuthMiddleware.execute);

ordersRouter.get('/:id', idParamsValidation, ordersController.show);
ordersRouter.post('/', createOrderValidate, ordersController.create);

export default ordersRouter;
