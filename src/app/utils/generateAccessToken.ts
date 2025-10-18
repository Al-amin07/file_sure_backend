import jwt from 'jsonwebtoken';
import config from '../config';
export const generateAccessToken = async (data: any) => {
  const token = jwt.sign(data, config.jwt_secret as string, {
    expiresIn: 60 * 60 * 24,
  });
  return token;
};
