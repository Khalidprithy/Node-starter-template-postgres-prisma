// src/app.ts
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import configureApp from './src/config/config';
import errorHandler from './src/config/errorHandler';
import createRoutes from './src/config/router';
import successLogger from './src/middlewares/successLogger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration
configureApp(app);

// Use the success logger middleware
app.use(successLogger);

// Serve static files (logs) from the 'logs' directory
app.use('/logs', express.static(path.join(__dirname, './logs')));

// Routes
createRoutes(app);

// Error Handling
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
   console.log(`BlackBoard Backend running on port ${PORT}`);
});
