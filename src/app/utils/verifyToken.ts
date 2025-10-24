import jwt from 'jsonwebtoken';
import config from '../config';
import ApppError from '../error/Apperror';
import { StatusCodes } from 'http-status-codes';
export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwt_secret as string);
    return decoded;
  } catch (error: any) {
    throw new ApppError(StatusCodes.UNAUTHORIZED, error?.message);
  }
};
