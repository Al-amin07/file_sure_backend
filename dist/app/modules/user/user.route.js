"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const route = (0, express_1.Router)();
route.post('/register', user_controller_1.userController.register);
route.post('/login', user_controller_1.userController.login);
exports.userRoute = route;
