import httpStatus from '../utils/httpStatus';
import bcrypt from 'bcrypt';
import decodeToken from '../utils/decodeToken';
import { Request, Response, NextFunction } from 'express';

export const login = async (credentials: {
    password: string;
    email?: string;
    phone?: string;
  }) => {
    try {
      const comparePass = bcrypt.compareSync(
        credentials.password, //user submitted password
        credentials.password //password from database
      );
      if (comparePass) {
        return {
          status: httpStatus.success,
          error: false,
          message: 'User Verified',
          data: null,
        };
      } else {
        return {
          error: true,
          data: null,
          status: 404,
          message: 'Account Not Found. Try E-Mail',
        };
      }
    } catch (err) {
      return {
        status: 500,
        error: true,
        data: String(err),
        message: 'Error While Log-in',
      };
    }
  },
  requiredToken = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      if (!request.headers['authorization']) {
        return response.status(httpStatus.not_found).send({
          status: httpStatus.not_found,
          error: true,
          message: 'You must Log-in first',
          originalInfo:
            'Header not found the token, authController=>requiredToken method',
        });
      } else {
        const authResult: any = await decodeToken(
          request.headers['authorization']
        );
        if (authResult.expiredAt) {
          return response.status(406).send({
            status: 406,
            error: true,
            message: 'Session Expired. Log-in Again',
            data: null,
          });
        } else if (authResult.id) {
          const isUserVerified = {
            //chech weather user exist or not
          };
          if (isUserVerified) {
            request['user'] = isUserVerified;
            request['user'].id = Number(request['user'].id);
            next();
          } else {
            return response.status(httpStatus.not_found).send({
              status: httpStatus.not_found,
              error: true,
              message: 'Unauthorized Access',
              data: null,
            });
          }
        } else {
          return response.status(httpStatus.bad_request).send({
            status: httpStatus.bad_request,
            error: true,
            message: 'Invalid Access Token',
            originalInfo: 'Token decoding failed!',
          });
        }
      }
    } catch (err) {
      return response.status(httpStatus.not_found).send({
        status: httpStatus.not_found,
        error: true,
        message: 'Token is required to access this route!',
        originalInfo: err,
      });
    }
  };
