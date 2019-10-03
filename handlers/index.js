import express from 'express';
import { isAuthorized } from '../config/utils';

import {
  register,
  login,
  insertUser,
  updateUser,
  deleteUser,
  queryUsers
} from './users';

const app = express();

const handlers = [
  // USERS
  app.get('/users', isAuthorized, queryUsers),
  app.post('/user', isAuthorized, insertUser),
  app.put('/user/:_id', isAuthorized, updateUser),
  app.delete('/user/:_id', isAuthorized, deleteUser),
  app.post('/login', login),
  app.post('/register', register)
];

export default handlers;
