import { Router } from 'express';
import { userController } from './user.controller';

const route = Router();

route.post('/register', userController.register);
route.post('/login', userController.login);

export const userRoute = route;
