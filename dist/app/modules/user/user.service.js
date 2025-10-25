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
exports.userService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Apperror_1 = __importDefault(require("../../error/Apperror"));
const generateAccessToken_1 = require("../../utils/generateAccessToken");
const generateReferralCode_1 = __importDefault(require("../../utils/generateReferralCode"));
const hasedPassword_1 = require("../../utils/hasedPassword");
const user_model_1 = require("./user.model");
const http_status_codes_1 = require("http-status-codes");
const referral_model_1 = require("../referal/referral.model");
const verifyToken_1 = require("../../utils/verifyToken");
// const register = async (payload: IUser, query: Record<string, unknown>) => {
//   const referradBy = query?.r;
//   if (payload?.password.length < 6) {
//     throw new ApppError(
//       StatusCodes.NOT_ACCEPTABLE,
//       'Password must be at least 6 char',
//     );
//   }
//   const isUserExist = await User.findOne({ email: payload?.email });
//   if (isUserExist) {
//     throw new ApppError(StatusCodes.NOT_ACCEPTABLE, 'User already exist');
//   }
//   const referralCode = generateReferralCode(payload?.name);
//   payload.referralCode = referralCode;
//   payload.password = await hashPassword(payload?.password);
//   if (referradBy) {
//     const isReferradByExist = await User.findOne({ referralCode: referradBy });
//     if (!isReferradByExist) {
//       throw new ApppError(StatusCodes.NOT_FOUND, 'Referral user not found');
//     }
//     payload.referredBy = isReferradByExist?.id;
//   }
//   const result = await User.create(payload);
//   return result;
// };
const register = (payload, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const referredBy = query === null || query === void 0 ? void 0 : query.r;
    if ((payload === null || payload === void 0 ? void 0 : payload.password.length) < 6) {
        throw new Apperror_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Password must be at least 6 char');
    }
    const isUserExist = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (isUserExist) {
        throw new Apperror_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'User already exist');
    }
    const referralCode = (0, generateReferralCode_1.default)(payload === null || payload === void 0 ? void 0 : payload.name);
    payload.referralCode = referralCode;
    payload.password = yield (0, hasedPassword_1.hashPassword)(payload === null || payload === void 0 ? void 0 : payload.password);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const result = yield user_model_1.User.create([payload], { session });
        console.log({ result });
        if (referredBy) {
            const isReferredByExist = yield user_model_1.User.findOne({
                referralCode: referredBy,
            });
            if (!isReferredByExist) {
                throw new Apperror_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Referral user not found');
            }
            yield referral_model_1.Referral.create([
                {
                    referralBy: isReferredByExist === null || isReferredByExist === void 0 ? void 0 : isReferredByExist.id,
                    referralTo: (_a = result[0]) === null || _a === void 0 ? void 0 : _a.id,
                },
            ], { session });
        }
        const tokenData = {
            id: (_b = result[0]) === null || _b === void 0 ? void 0 : _b.id,
            name: (_c = result[0]) === null || _c === void 0 ? void 0 : _c.name,
            email: (_d = result[0]) === null || _d === void 0 ? void 0 : _d.email,
            referalCode: (_e = result[0]) === null || _e === void 0 ? void 0 : _e.referralCode,
        };
        const accessToken = yield (0, generateAccessToken_1.generateAccessToken)(tokenData);
        yield session.commitTransaction();
        session.endSession();
        return { accessToken };
    }
    catch (error) {
        // Rollback transaction
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isuserExist = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (!isuserExist) {
        throw new Apperror_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    const isPasswordMached = yield (0, hasedPassword_1.verifyPassword)(isuserExist === null || isuserExist === void 0 ? void 0 : isuserExist.password, payload === null || payload === void 0 ? void 0 : payload.password);
    if (!isPasswordMached) {
        throw new Apperror_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Incorrect password');
    }
    const tokenData = {
        id: isuserExist === null || isuserExist === void 0 ? void 0 : isuserExist.id,
        name: isuserExist === null || isuserExist === void 0 ? void 0 : isuserExist.name,
        email: isuserExist === null || isuserExist === void 0 ? void 0 : isuserExist.email,
        referalCode: isuserExist === null || isuserExist === void 0 ? void 0 : isuserExist.referralCode,
    };
    const accessToken = yield (0, generateAccessToken_1.generateAccessToken)(tokenData);
    return { accessToken };
});
const state = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new Apperror_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'No token found');
    }
    const decoded = yield (0, verifyToken_1.verifyToken)(token);
    const referral = yield referral_model_1.Referral.find({
        referralBy: decoded.id,
    }).populate({ path: 'referralTo' });
    return referral;
});
exports.userService = {
    register,
    login,
};
