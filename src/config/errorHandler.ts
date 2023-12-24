import { NextFunction, Request, Response } from 'express';
import path from 'path';
import winston from 'winston';

const logsDir = path.join(__dirname, '../../logs');

// Ensure the logs directory exists
if (!winston.transports.File) {
   require('winston-daily-rotate-file');
   require('mkdirp').sync(logsDir);
}

const logger = winston.createLogger({
   level: 'error',
   format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.json()
   ),
   transports: [
      new winston.transports.Console(),
      new winston.transports.File({
         filename: path.join(logsDir, 'errors.txt')
      })
      // You can add additional transports as needed
   ]
});

const errorHandler = (
   err: any,
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   // Log the error using Winston
   logger.error(err.stack);

   // Customize the error message based on the error type or provide additional details
   const errorMessage = err.message || 'Something went wrong!';

   // Send the error response with a more detailed error message
   res.status(500).json({
      success: false,
      error: errorMessage,
      details: err.stack
   });
};

export default errorHandler;
