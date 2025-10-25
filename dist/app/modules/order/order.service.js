"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const referral_model_1 = require("../referal/referral.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const verifyToken_1 = require("../../utils/verifyToken");
const Apperror_1 = __importDefault(require("../../error/Apperror"));
const http_status_codes_1 = require("http-status-codes");
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ id: payload === null || payload === void 0 ? void 0 : payload.orderBy });
    const isReferralExist = yield referral_model_1.Referral.findOne({
        referralTo: payload === null || payload === void 0 ? void 0 : payload.orderBy,
    });
    console.log({ isUserExist, isReferralExist });
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (isReferralExist && (isReferralExist === null || isReferralExist === void 0 ? void 0 : isReferralExist.status) === 'PENDING') {
            yield user_model_1.User.findByIdAndUpdate(isReferralExist === null || isReferralExist === void 0 ? void 0 : isReferralExist.referralTo, {
                $inc: { balance: 2 },
            }, { new: true, session });
            yield user_model_1.User.findByIdAndUpdate(isReferralExist === null || isReferralExist === void 0 ? void 0 : isReferralExist.referralBy, {
                $inc: { balance: 2 },
            }, { new: true, session });
            const updateReferral = yield referral_model_1.Referral.findByIdAndUpdate(isReferralExist === null || isReferralExist === void 0 ? void 0 : isReferralExist.id, { status: 'CONVERTED', convertedAt: Date() });
        }
        const result = yield order_model_1.Order.create(payload);
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        // Rollback transaction
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const orderHistory = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new Apperror_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'No token found');
    }
    const decoded = yield (0, verifyToken_1.verifyToken)(token);
    console.log({ decoded });
    const result = yield order_model_1.Order.find({ orderBy: decoded.id });
    const referral = yield referral_model_1.Referral.find({
        referralBy: decoded.id,
    }).populate({ path: 'referralTo' });
    const user = yield user_model_1.User.findById(decoded.id);
    console.log({ user });
    return {
        order: result,
        referral,
        user,
    };
    // return result;
});
exports.orderService = {
    createOrder,
    orderHistory,
};
