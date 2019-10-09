export const isAdminOrOwnUser = async (req, res, next) => {
  console.log(req);
  const {
    user,
    params: { _id }
  } = req;
  if (user.role === 'admin' || user._id === _id) {
    return next();
  } else {
    jsonRes(res, 401, null, err.message);
  }
};
