"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    referralCode: { type: String, required: true },
    // courses: {type [String]},
    balance: { type: Number, default: 0 },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
