import express from 'express';

export const apiKeyMiddleware = (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
) => {
   const apiKey = req.headers['x-api-key'];

   if (!apiKey || apiKey !== process.env.API_KEY) {
      return res
         .status(401)
         .json({ error: 'Access denied. Invalid or missing API key.' });
   }
   next();
};
