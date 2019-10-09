import { CONSOLE_COLORS } from './constants';

export const logRequests = async (req, _, next) => {
  console.log(
    `${CONSOLE_COLORS.bright}${CONSOLE_COLORS.yellow} ${req.method}:${CONSOLE_COLORS.white} ${req.originalUrl}${CONSOLE_COLORS.reset}`
  );
  return next();
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
