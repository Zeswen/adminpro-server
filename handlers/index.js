import express from 'express';
import { insertCustomers, queryCustomers } from './customers';

const app = express();

const handlers = [
  // CUSTOMERS
  app.get('/customers', queryCustomers),
  app.post('/customers', insertCustomers)
];

export default handlers;
