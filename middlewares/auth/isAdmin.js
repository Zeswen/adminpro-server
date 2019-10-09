export const isAdmin = async (req, res, next) => {
  const { user } = req;
  if (user.role === 'admin') {
    return next();
  } else {
    jsonRes(res, 401, null, err.message);
  }
};
