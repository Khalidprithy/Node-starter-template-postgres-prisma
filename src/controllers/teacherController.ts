// src/controllers/teacherController.ts

import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import TeacherModel from '../models/Teacher';

export const getAllTeachers = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const teachers = await TeacherModel.find();
      res.json({ success: true, teachers });
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
      const teacherModel = new TeacherModel({
         name,
         subject,
         qualification,
         experience,
         contactInfo
      });

      const savedTeacher = await teacherModel.save();

      res.json({
         success: true,
         teacher: {
            name: savedTeacher.name,
            subject: savedTeacher.subject,
            qualification: savedTeacher.qualification,
            experience: savedTeacher.experience,
            contactInfo: savedTeacher.contactInfo
         }
      });
   } catch (error) {
      console.error('Error saving teacher to MongoDB:', error);
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

   const teacherId = req.params.id;
   const { name, subject, qualification, experience, contactInfo } = req.body;

   try {
      const teacher = await TeacherModel.findById(teacherId);

      if (!teacher) {
         return res
            .status(404)
            .json({ success: false, error: 'Teacher not found' });
      }

      teacher.name = name;
      teacher.subject = subject;
      teacher.qualification = qualification;
      teacher.experience = experience;
      teacher.contactInfo = contactInfo;

      await teacher.save();

      res.json({
         success: true,
         teacher: {
            name: teacher.name,
            subject: teacher.subject,
            qualification: teacher.qualification,
            experience: teacher.experience,
            contactInfo: teacher.contactInfo
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
   const teacherId = req.params.id;

   try {
      const deletedTeacher = await TeacherModel.findByIdAndDelete(teacherId);

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
