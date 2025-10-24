import { Router } from 'express';
import { orderController } from './order.controller';

const route = Router();

route.post('/', orderController.createOrder);
route.get('/history', orderController.orderHistory);

export const orderRoute = route;
