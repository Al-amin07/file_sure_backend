"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res) => {
    return res.status(500).json({
        success: false,
        message: 'API not found',
        error: 'Not found',
    });
};
exports.default = notFound;
