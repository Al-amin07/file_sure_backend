import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { orderService } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const result = await orderService.createOrder(req.body);
  sendResponse(res, {
    data: result,
    message: 'Order palced successfully',
    success: true,
    statusCode: StatusCodes.CREATED,
  });
});

export const orderController = {
  createOrder,
};
