import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllStudents = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const students = await prisma.student.findMany();
      res.status(200).json({ success: true, data: students });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const createStudent = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { name, age, className, admissionDate } = req.body;

      const newStudent = await prisma.student.create({
         data: {
            name,
            age,
            className,
            admissionDate
         }
      });

      res.status(201).json({ success: true, data: newStudent });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const updateStudent = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;
      const { name, age, className, admissionDate } = req.body;

      const updatedStudent = await prisma.student.update({
         where: { id: parseInt(id, 10) },
         data: {
            name,
            age,
            className,
            admissionDate
         }
      });

      res.status(200).json({ success: true, data: updatedStudent });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const deleteStudent = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;

      await prisma.student.delete({
         where: { id: parseInt(id, 10) }
      });

      res.status(204).send({
         success: true,
         message: 'Student deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
