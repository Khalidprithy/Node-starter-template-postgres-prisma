// src/app.ts

import dotenv from 'dotenv';
import express from 'express';
import configureApp from './src/config/config';
import connectToDatabase from './src/config/db';
import errorHandler from './src/config/errorHandler';
import createRoutes from './src/config/router';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// App Configuration and API_KEY middleware
configureApp(app);

// MongoDB connection
connectToDatabase();

// Main Route
createRoutes(app);

// App errorHandler
app.use(errorHandler);

app.listen(PORT, () => {
   console.log(`BlackBoard Backend running on port ${PORT}`);
});
