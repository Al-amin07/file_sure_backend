import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';
import { orderRoute } from '../modules/order/order.route';

const route = Router();
const modules = [
  { path: '/user', route: userRoute },
  { path: '/order', route: orderRoute },
];

modules.map((el) => route.use(el.path, el.route));
export default route;
