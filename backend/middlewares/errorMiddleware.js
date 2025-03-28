
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Handle Mongoose Bad ObjectId Errors
  if (err.name === "CastError") {
    statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    err.message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  // Handle Duplicate Key Errors
  if (err.code === 11000) {
    statusCode = 400;
    err.message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
  }

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
  });
};

export { errorHandler };

  
  