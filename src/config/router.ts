// src/config/router.ts

import express from 'express';
import path from 'path';
import blogRoute from '../api/blogRoute';
import courseRoute from '../api/courseRoute';
import employeeRoute from '../api/employeeRoute';
import eventRoute from '../api/eventRoute';
import schoolRoute from '../api/schoolRoute';
import studentRoute from '../api/studentRoute';
import teacherRoute from '../api/teacherRoute';
import userRoute from '../api/userRoute';

const createRoutes = (app: express.Application): void => {
   // 'public' directory access
   app.use(express.static(path.join(__dirname, '../../public')));

   // secure routes starts with '/api'

   app.use('/api/user', userRoute);
   app.use('/api/event', eventRoute);
   app.use('/api/employee', employeeRoute);
   app.use('/api/blog', blogRoute);
   app.use('/api/school', schoolRoute);
   app.use('/api/teacher', teacherRoute);
   app.use('/api/student', studentRoute);
   app.use('/api/course', courseRoute);
   // other routes here
};

export default createRoutes;
