import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { CONSOLE_COLORS } from './constants';

const { SECRET_KEY } = process.env;

export const logRequests = async (req, _, next) => {
  console.log(
    `${CONSOLE_COLORS.bright}${CONSOLE_COLORS.yellow} ${req.method}:${CONSOLE_COLORS.white} ${req.originalUrl}${CONSOLE_COLORS.reset}`
  );
  return next();
};

export const isAuthorized = async (req, res, next) => {
  try {
    const { token } = req.query;
    await new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
    return next();
  } catch (err) {
    console.error(err);
    jsonRes(res, 401, null, err);
  }
};

export const jsonRes = (res, status, data, error) => {
  if (error) {
    return res.status(status).json({
      OK: false,
      status: status,
      data: null,
      error: error
    });
  }
  return res.status(status).json({
    OK: true,
    status: status,
    data: data,
    error: null
  });
};
