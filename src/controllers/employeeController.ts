import { NextFunction, Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllEmployees = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const employees = await prisma.employee.findMany();
      res.status(200).json({ success: true, data: employees });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const createEmployee = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { name, position, department, joinDate, salary } = req.body;

      const newEmployee = await prisma.employee.create({
         data: {
            name,
            position,
            department,
            joinDate,
            salary
         }
      });

      res.status(201).json({ success: true, data: newEmployee });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const updateEmployee = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;
      const { name, position, department, joinDate, salary } = req.body;

      const updatedEmployee = await prisma.employee.update({
         where: { id: parseInt(id, 10) },
         data: {
            name,
            position,
            department,
            joinDate,
            salary
         }
      });

      res.status(200).json({ success: true, data: updatedEmployee });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const deleteEmployee = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;

      await prisma.employee.delete({
         where: { id: parseInt(id, 10) }
      });

      res.status(204).send({
         success: true,
         message: 'Employee deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
