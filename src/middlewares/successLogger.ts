// src/middleware/successLoggerMiddleware.ts
import express from 'express';
import path from 'path';
import winston from 'winston';

const successLogger = winston.createLogger({
   level: 'info',
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
   ),
   transports: [
      new winston.transports.File({
         filename: path.join(__dirname, '../../logs/success.txt')
      })
      // You can add additional transports as needed
   ]
});

const successLoggerMiddleware: express.RequestHandler = (req, res, next) => {
   const startTime = new Date();

   res.on('finish', () => {
      const endTime = new Date();
      const elapsedTime = endTime.getTime() - startTime.getTime();
      const logMessage = `${req.method} ${req.url} - ${res.statusCode} - ${
         res.getHeader('Content-Length') || 0
      }B - ${elapsedTime}ms`;
      successLogger.info(logMessage);
   });

   next();
};

export default successLoggerMiddleware;
