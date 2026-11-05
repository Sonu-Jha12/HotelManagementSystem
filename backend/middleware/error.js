exports.asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.HttpError = (status, message) => Object.assign(new Error(message), { status });
exports.errorHandler = (err, req, res, next) => {
  const status = err.code === 11000 ? 409 : err.status || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500);
  res.status(status).json({ error: err.code === 11000 ? 'That record already exists' : err.message });
};
