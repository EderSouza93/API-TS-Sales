import { Router } from 'express';

import CustomersControllers from '../controllers/CustomersControllers';
import AuthMiddleware from '@shared/middlewares/authMiddleware';
import {
  createCustomerSchema,
  idParamsValidate,
  updateCustomerSchema,
} from '../schemas/CustomerSchema';

const customersRouter = Router();
const customersController = new CustomersControllers();

customersRouter.use(AuthMiddleware.execute);
customersRouter.get('/', customersController.index);
customersRouter.get('/:id', idParamsValidate, customersController.show);
customersRouter.post('/', createCustomerSchema, customersController.create);
customersRouter.patch(
  '/:id',
  idParamsValidate,
  updateCustomerSchema,
  customersController.update,
);
customersRouter.delete('/:id', idParamsValidate, customersController.delete);

export default customersRouter;
