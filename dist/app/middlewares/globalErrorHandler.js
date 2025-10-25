"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHander = (err, req, res, next) => {
    const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || 500;
    const message = 'Something went wrong';
    res.status(statusCode).json({
        success: false,
        message: (err === null || err === void 0 ? void 0 : err.message) || message,
        err,
        stack: err === null || err === void 0 ? void 0 : err.stack,
    });
};
exports.default = globalErrorHander;
