// src/controllers/teacherController.ts
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const getAllTeachers = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const teachers = await prisma.teacher.findMany();
      res.json({ success: true, data: teachers });
   } catch (error) {
      console.error('Error fetching teachers:', error);
      next(error);
   }
};

export const createTeacher = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
   }

   const { name, subject, qualification, experience, contactInfo } = req.body;

   try {
      const newTeacher = await prisma.teacher.create({
         data: {
            name,
            subject,
            qualification,
            experience,
            contactInfo
         }
      });

      res.json({
         success: true,
         teacher: {
            name: newTeacher.name,
            subject: newTeacher.subject,
            qualification: newTeacher.qualification,
            experience: newTeacher.experience,
            contactInfo: newTeacher.contactInfo
         }
      });
   } catch (error) {
      console.error('Error saving teacher to Prisma:', error);
      next(error);
   }
};

export const updateTeacher = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
   }

   const teacherId = parseInt(req.params.id, 10);
   const { name, subject, qualification, experience, contactInfo } = req.body;

   try {
      const updatedTeacher = await prisma.teacher.update({
         where: { id: teacherId },
         data: {
            name,
            subject,
            qualification,
            experience,
            contactInfo
         }
      });

      res.json({
         success: true,
         teacher: {
            name: updatedTeacher.name,
            subject: updatedTeacher.subject,
            qualification: updatedTeacher.qualification,
            experience: updatedTeacher.experience,
            contactInfo: updatedTeacher.contactInfo
         }
      });
   } catch (error) {
      console.error('Error updating teacher:', error);
      next(error);
   }
};

export const deleteTeacher = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   const teacherId = parseInt(req.params.id, 10);

   try {
      const deletedTeacher = await prisma.teacher.delete({
         where: { id: teacherId }
      });

      if (!deletedTeacher) {
         return res
            .status(404)
            .json({ success: false, error: 'Teacher not found' });
      }

      res.json({
         success: true,
         message: 'Teacher deleted successfully',
         deletedTeacher: {
            name: deletedTeacher.name,
            subject: deletedTeacher.subject,
            qualification: deletedTeacher.qualification,
            experience: deletedTeacher.experience,
            contactInfo: deletedTeacher.contactInfo
         }
      });
   } catch (error) {
      console.error('Error deleting teacher:', error);
      next(error);
   }
};
