import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware';

// Determine allowed origins based on the environment
const allowedOrigins =
   process.env.NODE_ENV === 'production'
      ? ['https://allowed-production-origin.com']
      : ['http://localhost:3000']; // Adjust the local development origin as needed

// CORS options with allowed origins
const corsOptions = {
   origin: allowedOrigins,
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true // Enable credentials (e.g., cookies, authorization headers)
};

const configureApp = (app: express.Application): void => {
   // middlewares
   app.use(helmet());
   // Enable Cross-Origin Resource Sharing
   app.use(cors(corsOptions));
   app.use(express.urlencoded({ extended: false }));
   app.use(express.json());
   app.use(cookieParser());
   app.use(bodyParser.json({ limit: '1mb' }));

   // Verify API key
   app.use('/api', apiKeyMiddleware);
};

export default configureApp;
