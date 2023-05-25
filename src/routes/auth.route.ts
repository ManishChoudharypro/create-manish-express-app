import * as AuthController from '../controllers/auth.controller';
import { Router, Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';

export const AuthRoute = Router().post(
  '/login',
  async (request: Request, response: Response) => {
    try {
      const credentials: { email: string; password: string } = request.body,
        result = await AuthController.login(credentials);
      response.status(result.status).send(result);
    } catch (err) {
      response.status(httpStatus.internal_server_error).send({
        error: true,
        status: httpStatus.internal_server_error,
        message: 'Error While log-in! Try-Again',
        data: {
          string_err: String(err),
          err,
        },
      });
    }
  }
);
