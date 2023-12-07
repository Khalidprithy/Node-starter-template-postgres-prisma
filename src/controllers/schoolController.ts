import { NextFunction, Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSchool = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { name, location, students, teachers, foundedYear } = req.body;

      // // Validate that the school with the same name doesn't already exist
      // const existingSchool = await prisma.school.findUnique({
      //    where: { name },
      // });
      // if (existingSchool) {
      //    return res.status(400).json({
      //       success: false,
      //       error: 'School with the same name already exists',
      //    });
      // }

      const newSchool = await prisma.school.create({
         data: {
            name,
            location,
            students,
            teachers,
            foundedYear
         }
      });

      res.status(201).json({ success: true, data: newSchool });
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
      const schools = await prisma.school.findMany();
      res.status(200).json({ success: true, data: schools });
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

      const updatedSchool = await prisma.school.update({
         where: { id: parseInt(id, 10) },
         data: {
            name,
            location,
            students,
            teachers,
            foundedYear
         }
      });

      res.status(200).json({ success: true, data: updatedSchool });
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

      await prisma.school.delete({
         where: { id: parseInt(id, 10) }
      });

      res.status(204).send({
         success: true,
         message: 'School deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
