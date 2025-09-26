const errorController = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    status,
    message,
    err
  });
};

export default errorController;
