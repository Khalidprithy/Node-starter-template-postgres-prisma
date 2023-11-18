// src/config/router.ts

import express from 'express';
import path from 'path';
import userRoute from '../api/userRoute';

const createRoutes = (app: express.Application): void => {
   // Serve static files from the 'public' directory
   app.use(express.static(path.join(__dirname, '../../public')));

   // secure routes
   app.use('/api/user', userRoute);

   // Add other routes as needed
};

export default createRoutes;
