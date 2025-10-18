/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

const notFound = (req: Request, res: Response): any => {
  return res.status(500).json({
    success: false,
    message: 'API not found',
    error: 'Not found',
  });
};

export default notFound;
