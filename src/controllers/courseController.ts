import { NextFunction, Request, Response } from 'express';
import Course from '../models/Course';

export const getAllCourses = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const courses = await Course.find();
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

      const newCourse = new Course({
         courseName,
         instructor,
         duration,
         enrollmentCount,
         price
      });

      const savedCourse = await newCourse.save();
      res.status(201).json({ success: true, data: savedCourse });
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

      // Validate that the course ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res
            .status(400)
            .json({ success: true, error: 'Invalid course ID' });
      }

      // Validate that the course with the given ID exists
      const existingCourse = await Course.findById(id);
      if (!existingCourse) {
         return res
            .status(404)
            .json({ success: true, error: 'Course not found' });
      }

      // Update course fields
      existingCourse.courseName = courseName;
      existingCourse.instructor = instructor;
      existingCourse.duration = duration;
      existingCourse.enrollmentCount = enrollmentCount;
      existingCourse.price = price;

      const updatedCourse = await existingCourse.save();
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

      // Validate that the course ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res
            .status(400)
            .json({ success: true, error: 'Invalid course ID' });
      }

      // Validate that the course with the given ID exists
      const existingCourse = await Course.findById(id);
      if (!existingCourse) {
         return res
            .status(404)
            .json({ success: true, error: 'Course not found' });
      }

      await existingCourse.deleteOne();
      res.status(204).send({
         success: true,
         message: 'Course deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
