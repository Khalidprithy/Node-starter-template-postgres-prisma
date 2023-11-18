import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware';

const configureApp = (app: express.Application): void => {
   // middlewares
   app.use(helmet());
   app.use(cors());
   app.use(bodyParser.json({ limit: '1mb' }));

   // Verify API key
   app.use('/api', apiKeyMiddleware);
};

export default configureApp;
