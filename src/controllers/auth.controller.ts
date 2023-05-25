import { config } from 'dotenv';
config();
import httpStatus from '../utils/httpStatus';
import bcrypt from 'bcrypt';
import decodeToken from '../utils/decodeToken';
import { Request, Response, NextFunction } from 'express';
import UserTable from '../models/user.model';
import jwt from 'jsonwebtoken';
const { ENCRYPTION_KEY } = process.env;
export const login = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const User = await UserTable.find(
        user => user.email == credentials.email
      );
      if (User == null) {
        return {
          status: httpStatus.not_found,
          error: true,
          message: 'Account Not Found!',
          data: null,
        };
      } else {
        //?  Compare the passwords using "bcrypt" package
        // const comparePass = bcrypt.compareSync(
        //   credentials.password, //user submitted password
        //   credentials.password //password from database
        // );
        const comparePass = User.password == credentials.password;
        if (comparePass) {
          const Token = jwt.sign(
            {
              id: User.id,
              name: User.name,
              email: User.email,
              last_login: new Date().toJSON(),
            },
            ENCRYPTION_KEY,
            { expiresIn: '7d' }
          );
          return {
            status: httpStatus.success,
            error: false,
            message: 'Logged In',
            data: {
              id: User.id,
              name: User.name,
              email: User.email,
              token: Token,
            },
          };
        } else {
          return {
            error: true,
            data: null,
            status: httpStatus.not_acceptable,
            message: 'Incorrect Email or Passsword',
          };
        }
      }
    } catch (err) {
      return {
        status: httpStatus.internal_server_error,
        error: true,
        data: String(err),
        message: 'Unable to Log-in! Try-Again.',
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
