import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';

const register = catchAsync(async (req, res) => {
  const query = req?.query;
  const result = await userService.register(req.body, query);
  sendResponse(res, {
    data: result,
    message: 'User Register successfully',
    success: true,
    statusCode: StatusCodes.CREATED,
  });
});
const login = catchAsync(async (req, res) => {
  const result = await userService.login(req.body);
  sendResponse(res, {
    data: result,
    message: 'User login successfully',
    success: true,
    statusCode: StatusCodes.CREATED,
  });
});

export const userController = {
  register,
  login,
};
