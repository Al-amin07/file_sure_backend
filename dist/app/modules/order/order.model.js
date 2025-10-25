"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    paymentMethod: {
        type: String,
        enum: ['credit', 'paypal', 'crypto'],
        required: true,
    },
    cardNumber: { type: String, required: true },
    expiry: { type: String, required: true },
    cvc: { type: String, required: true },
    price: { type: Number, required: true },
    courseId: { type: String },
    orderBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
