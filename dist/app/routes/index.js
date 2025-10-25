"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const order_route_1 = require("../modules/order/order.route");
const route = (0, express_1.Router)();
const modules = [
    { path: '/user', route: user_route_1.userRoute },
    { path: '/order', route: order_route_1.orderRoute },
];
modules.map((el) => route.use(el.path, el.route));
exports.default = route;
