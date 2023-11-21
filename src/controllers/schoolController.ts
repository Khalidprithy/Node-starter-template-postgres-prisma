import { NextFunction, Request, Response } from 'express';
import School from '../models/School';

export const createSchool = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { name, location, students, teachers, foundedYear } = req.body;

      // Validate that the school with the same name doesn't already exist
      const existingSchool = await School.findOne({ name });
      if (existingSchool) {
         return res
            .status(400)
            .json({ error: 'School with the same name already exists' });
      }

      const newSchool = new School({
         name,
         location,
         students,
         teachers,
         foundedYear
      });

      const savedSchool = await newSchool.save();
      res.status(201).json(savedSchool);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const getAllSchools = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const schools = await School.find();
      res.status(200).json(schools);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const updateSchool = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;
      const { name, location, students, teachers, foundedYear } = req.body;

      // Validate that the school ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({ error: 'Invalid school ID' });
      }

      // Validate that the school with the given ID exists
      const existingSchool = await School.findById(id);
      if (!existingSchool) {
         return res.status(404).json({ error: 'School not found' });
      }

      // Update school fields
      existingSchool.name = name;
      existingSchool.location = location;
      existingSchool.students = students;
      existingSchool.teachers = teachers;
      existingSchool.foundedYear = foundedYear;

      const updatedSchool = await existingSchool.save();
      res.status(200).json(updatedSchool);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const deleteSchool = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;

      // Validate that the school ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({ error: 'Invalid school ID' });
      }

      // Validate that the school with the given ID exists
      const existingSchool = await School.findById(id);
      if (!existingSchool) {
         return res.status(404).json({ error: 'School not found' });
      }

      await existingSchool.deleteOne();
      res.status(204).send();
   } catch (error) {
      console.error(error);
      next(error);
   }
};
