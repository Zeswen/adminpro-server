import express from 'express';
import { insertUser, queryUsers } from './users';

const app = express();

const handlers = [
  // CUSTOMERS
  app.get('/users', queryUsers),
  app.post('/users', insertUser)
];

export default handlers;
