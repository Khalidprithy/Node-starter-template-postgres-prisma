import { NextFunction, Request, Response } from 'express';
import Student from '../models/Student';

export const getAllStudents = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const students = await Student.find();
      res.status(200).json(students);
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

      const newStudent = new Student({
         name,
         age,
         className,
         admissionDate
      });

      const savedStudent = await newStudent.save();
      res.status(201).json(savedStudent);
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

      // Validate that the student ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({ error: 'Invalid student ID' });
      }

      // Validate that the student with the given ID exists
      const existingStudent = await Student.findById(id);
      if (!existingStudent) {
         return res.status(404).json({ error: 'Student not found' });
      }

      // Update student fields
      existingStudent.name = name;
      existingStudent.age = age;
      existingStudent.className = className;
      existingStudent.admissionDate = admissionDate;

      const updatedStudent = await existingStudent.save();
      res.status(200).json(updatedStudent);
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

      // Validate that the student ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({ error: 'Invalid student ID' });
      }

      // Validate that the student with the given ID exists
      const existingStudent = await Student.findById(id);
      if (!existingStudent) {
         return res.status(404).json({ error: 'Student not found' });
      }

      await existingStudent.deleteOne();
      res.status(204).send();
   } catch (error) {
      console.error(error);
      next(error);
   }
};
