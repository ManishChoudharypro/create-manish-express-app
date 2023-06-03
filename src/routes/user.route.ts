import * as UserController from '../controllers/user.controller';
import { Router, Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';
export const UserRoutes = Router()
  .post('/', async (req: Request, res: Response) => {
    try {
      const newUser = req.body;
      //Validate New User Here
      const result = await UserController.addUser(newUser);
      res.status(result.status).send(result);
    } catch (err) {
      res.status(httpStatus.precondition_failed).send({
        status: httpStatus.precondition_failed,
        error: true,
        message: 'Error Adding User',
        data: { string_err: String(err), err },
      });
    }
  })
  .get('/', async (req: Request, res: Response) => {
    try {
      const result = await UserController.getUsers();
      res.status(result.status).send(result);
    } catch (err) {
      res.status(httpStatus.precondition_failed).send({
        status: httpStatus.precondition_failed,
        error: true,
        message: 'Error Fetching Users!',
        data: { string_err: String(err), err },
      });
    }
  })
  .get('/:id', async (req: Request, res: Response) => {
    try {
      const ID: number = Number(req.params.id),
        result = await UserController.getUserByID(ID);
      res.status(result.status).send(result);
    } catch (err) {
      res.status(httpStatus.precondition_failed).send({
        status: httpStatus.precondition_failed,
        error: true,
        message: 'Error Fetching User!',
        data: { string_err: String(err), err },
      });
    }
  });
