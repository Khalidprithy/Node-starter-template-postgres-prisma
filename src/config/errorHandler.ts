// src/config/errorHandler.ts

import express from 'express';

const errorHandler = (
   err: any,
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
): void => {
   console.error(err.stack);
   res.status(500).send('Something went wrong!');
};

export default errorHandler;
