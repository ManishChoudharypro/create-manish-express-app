import { config } from 'dotenv';
config();
import httpStatus from '../utils/httpStatus';
import decodeToken from '../utils/decodeToken';
import UserTable from '../models/user.model';

export async function addUser(newUser: {
  id: number | undefined;
  email: string;
  name: string;
  password: string;
}) {
  try {
    const isEmailExist = await UserTable.find(
      user => user.email == newUser.email
    );
    if (isEmailExist != null)
      return {
        status: httpStatus.conflict,
        error: true,
        message: 'E-Mail Already Exist',
        data: null,
      };
    newUser.id = UserTable.length + 1;
    newUser.email = newUser.email.trim().toLowerCase();
    await UserTable.push(newUser);
    return {
      status: httpStatus.created,
      error: false,
      message: 'User Added',
      data: newUser,
    };
  } catch (err) {
    return {
      status: httpStatus.internal_server_error,
      error: true,
      message: 'Unable to add user',
      data: err,
    };
  }
}
export async function getUsers() {
  try {
    const Users = UserTable.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
    if (Users.length == 0) {
      return {
        status: httpStatus.not_found,
        error: true,
        message: 'No User Found!',
        data: null,
      };
    }
    return {
      status: httpStatus.success,
      error: false,
      message: 'Users Fetched',
      data: {
        count: Users.length,
        rows: Users,
      },
    };
  } catch (err) {
    return {
      status: httpStatus.internal_server_error,
      error: true,
      message: 'Unable to fetch Users! Try-Again',
      data: err,
    };
  }
}
export async function getUserByID(id: number) {
  try {
    const User = await UserTable.find(user => user.id == id);
    if (User == null) {
      return {
        status: httpStatus.not_found,
        error: true,
        message: 'User Not Found',
        data: null,
      };
    }
    return {
      status: httpStatus.success,
      error: false,
      message: 'User Fetched',
      data: User,
    };
  } catch (err) {
    return {
      status: httpStatus.internal_server_error,
      error: true,
      message: 'Unable To fetch User!',
      data: err,
    };
  }
}
