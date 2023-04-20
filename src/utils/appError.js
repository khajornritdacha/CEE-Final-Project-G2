class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
<<<<<<< HEAD
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
=======
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
