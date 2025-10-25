"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Referral = void 0;
const mongoose_1 = require("mongoose");
const referralSchema = new mongoose_1.Schema({
    referralBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    referralTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: { type: String, enum: ['PENDING', 'CONVERTED'], default: 'PENDING' },
    convertedAt: { type: Date, default: null },
});
referralSchema.index({ referralBy: 1 }, { unique: true });
exports.Referral = (0, mongoose_1.model)('Referral', referralSchema);
