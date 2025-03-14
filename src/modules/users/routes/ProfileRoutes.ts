import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import { UpdateUserSchema } from '../schemas/UpdateUserSchema';
import AuthMiddleware from '@shared/middlewares/authMiddleware';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(AuthMiddleware.execute);
profileRouter.get('/', profileController.show);
profileRouter.get('/', UpdateUserSchema, profileController.update);

export default profileRouter;
