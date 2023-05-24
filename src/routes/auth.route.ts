import * as AuthController from '../controllers/auth.controller';
import { Router, Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';

export const AuthRoute = Router().post(
  '/login',
  async (request: Request, response: Response) => {
    try {
      const credentials = request.body,
        result = await AuthController.login(credentials);
      return response.status(result.status).send(result);
    } catch (err) {
      return response.status(httpStatus.internal_server_error).send({
        error: true,
        status: httpStatus.internal_server_error,
        message: 'Internal Server Error',
        data: {
          string_err: String(err),
          err,
        },
      });
    }
  }
);
