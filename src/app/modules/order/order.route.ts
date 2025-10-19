import { Router } from 'express';
import { orderController } from './order.controller';

const route = Router();

route.post('/', orderController.createOrder);

export const orderRoute = route;
