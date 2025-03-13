import { Router } from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordControllers';
import ResetPasswordController from '../controllers/ResetPasswordController';
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from '../schemas/PasswordSchema';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  ForgotPasswordSchema,
  forgotPasswordController.create,
);

passwordRouter.post(
  '/reset',
  ResetPasswordSchema,
  resetPasswordController.create,
);

export default passwordRouter;
