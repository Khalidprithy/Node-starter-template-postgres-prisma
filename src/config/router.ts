// src/config/router.ts

import express from 'express';
import path from 'path';
import userRoute from '../api/userRoute';
import verifyJWT from '../middlewares/verifyJWT';

const createRoutes = (app: express.Application): void => {
   // 'public' directory access
   app.use(express.static(path.join(__dirname, '../../public')));

   // secure routes starts with '/api'

   app.use('/api/user', userRoute);
   app.use(verifyJWT);
   // other routes here
};

export default createRoutes;
