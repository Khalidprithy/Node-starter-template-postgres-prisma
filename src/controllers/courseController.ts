import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllCourses = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const courses = await prisma.course.findMany();
      res.status(200).json({ success: true, data: courses });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const createCourse = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { courseName, instructor, duration, enrollmentCount, price } =
         req.body;

      const newCourse = await prisma.course.create({
         data: {
            courseName,
            instructor,
            duration,
            enrollmentCount,
            price
         }
      });

      res.status(201).json({ success: true, data: newCourse });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const updateCourse = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;
      const { courseName, instructor, duration, enrollmentCount, price } =
         req.body;

      const updatedCourse = await prisma.course.update({
         where: { id: parseInt(id, 10) },
         data: {
            courseName,
            instructor,
            duration,
            enrollmentCount,
            price
         }
      });

      res.status(200).json({ success: true, data: updatedCourse });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const deleteCourse = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;

      await prisma.course.delete({
         where: { id: parseInt(id, 10) }
      });

      res.status(204).send({
         success: true,
         message: 'Course deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
