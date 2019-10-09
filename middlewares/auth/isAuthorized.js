import 'dotenv/config';
import jwt from 'jsonwebtoken';

const { SECRET_KEY } = process.env;

export const isAuthorized = async (req, res, next) => {
  try {
    const { token } = req.query;
    await new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        req.user = decoded.user;
        resolve(decoded);
      });
    });
    return next();
  } catch (err) {
    console.error(err);
    jsonRes(res, 401, null, err.message);
  }
};
