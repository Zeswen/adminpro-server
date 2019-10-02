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
