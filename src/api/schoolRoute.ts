import express from 'express';
import { body, param } from 'express-validator';
import {
   createSchool,
   deleteSchool,
   getAllSchools,
   updateSchool
} from '../controllers/schoolController';

const router = express.Router();

// Common validation middleware
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const locationValidation = body('location')
   .notEmpty()
   .withMessage('Location is required');
const studentsValidation = body('students')
   .notEmpty()
   .isInt()
   .withMessage('Valid number of students is required');
const teachersValidation = body('teachers')
   .notEmpty()
   .isInt()
   .withMessage('Valid number of teachers is required');
const foundedYearValidation = body('foundedYear')
   .notEmpty()
   .isInt()
   .withMessage('Valid founded year is required');

// Create School Route Validation
const createSchoolValidation = [
   nameValidation,
   locationValidation,
   studentsValidation,
   teachersValidation,
   foundedYearValidation
];

// Update School Route Validation
const updateSchoolValidation = [
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid school ID is required'),
   nameValidation,
   locationValidation,
   studentsValidation,
   teachersValidation,
   foundedYearValidation
];

// Get All Schools Route
router.get('/all', getAllSchools);

// Create School Route
router.post('/create', createSchoolValidation, createSchool);

// Update School Route
router.put('/update/:id', updateSchoolValidation, updateSchool);

// Delete School Route
router.delete(
   '/delete/:id',
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid school ID is required'),
   deleteSchool
);

export default router;
