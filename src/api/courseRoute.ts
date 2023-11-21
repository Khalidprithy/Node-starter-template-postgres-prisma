import express from 'express';
import { body, param } from 'express-validator';
import {
   createCourse,
   deleteCourse,
   getAllCourses,
   updateCourse
} from '../controllers/courseController';

const router = express.Router();

// Common validation middleware
const courseNameValidation = body('courseName')
   .notEmpty()
   .withMessage('Course Name is required');
const instructorValidation = body('instructor')
   .notEmpty()
   .withMessage('Instructor is required');
const durationValidation = body('duration')
   .notEmpty()
   .isInt()
   .withMessage('Valid duration is required');
const enrollmentCountValidation = body('enrollmentCount')
   .notEmpty()
   .isInt()
   .withMessage('Valid enrollment count is required');
const priceValidation = body('price')
   .notEmpty()
   .isCurrency()
   .withMessage('Valid currency format is required');

// Create Course Route Validation
const createCourseValidation = [
   courseNameValidation,
   instructorValidation,
   durationValidation,
   enrollmentCountValidation,
   priceValidation
];

// Update Course Route Validation
const updateCourseValidation = [
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid course ID is required'),
   courseNameValidation,
   instructorValidation,
   durationValidation,
   enrollmentCountValidation,
   priceValidation
];

// Get All Courses Route
router.get('/all', getAllCourses);

// Create Course Route
router.post('/create', createCourseValidation, createCourse);

// Update Course Route
router.put('/update/:id', updateCourseValidation, updateCourse);

// Delete Course Route
router.delete(
   '/delete/:id',
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid course ID is required'),
   deleteCourse
);

export default router;
