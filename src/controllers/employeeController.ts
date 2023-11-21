import { NextFunction, Request, Response } from 'express';
import Employee from '../models/Employee';

export const getAllEmployees = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const employees = await Employee.find();
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

      const newEmployee = new Employee({
         name,
         position,
         department,
         joinDate,
         salary
      });

      const savedEmployee = await newEmployee.save();
      res.status(201).json({ success: true, data: savedEmployee });
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

      // Validate that the employee ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res
            .status(400)
            .json({ success: false, error: 'Invalid employee ID' });
      }

      // Validate that the employee with the given ID exists
      const existingEmployee = await Employee.findById(id);
      if (!existingEmployee) {
         return res
            .status(404)
            .json({ success: false, error: 'Employee not found' });
      }

      // Update employee fields
      existingEmployee.name = name;
      existingEmployee.position = position;
      existingEmployee.department = department;
      existingEmployee.joinDate = joinDate;
      existingEmployee.salary = salary;

      const updatedEmployee = await existingEmployee.save();
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

      // Validate that the employee ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res
            .status(400)
            .json({ success: false, error: 'Invalid employee ID' });
      }

      // Validate that the employee with the given ID exists
      const existingEmployee = await Employee.findById(id);
      if (!existingEmployee) {
         return res
            .status(404)
            .json({ success: false, error: 'Employee not found' });
      }

      await existingEmployee.deleteOne();
      res.status(204).send({
         success: true,
         message: 'Employee deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
