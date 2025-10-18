import { Response } from 'express';

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  return res.status(data?.statusCode).json({
    success: data?.success,
    statusCode: data?.statusCode,
    message: data?.message,
    data: data?.data,
  });
};

export default sendResponse;
