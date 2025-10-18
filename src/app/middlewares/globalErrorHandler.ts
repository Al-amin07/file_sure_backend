/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

const globalErrorHander = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const statusCode = err?.statusCode || 500;
  const message = 'Something went wrong';
  res.status(statusCode).json({
    success: false,
    message: err?.message || message,
    err,
    stack: err?.stack,
  });
};

export default globalErrorHander;
