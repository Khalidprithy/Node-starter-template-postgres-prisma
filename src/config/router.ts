// src/config/router.ts

import express from 'express';
import path from 'path';
import schoolRoute from '../api/schoolRoute';
import studentRoute from '../api/studentRoute';
import teacherRoute from '../api/teacherRoute';
import userRoute from '../api/userRoute';

const createRoutes = (app: express.Application): void => {
   // 'public' directory access
   app.use(express.static(path.join(__dirname, '../../public')));

   // secure routes starts with '/api'

   app.use('/api/user', userRoute);
   app.use('/api/school', schoolRoute);
   app.use('/api/teacher', teacherRoute);
   app.use('/api/student', studentRoute);
   // other routes here
};

export default createRoutes;
