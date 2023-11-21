import express from 'express';
import { body, param } from 'express-validator';
import {
   createStudent,
   deleteStudent,
   getAllStudents,
   updateStudent
} from '../controllers/studentController';

const router = express.Router();

// Common validation middleware
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const ageValidation = body('age')
   .notEmpty()
   .isInt()
   .withMessage('Valid age is required');
const classNameValidation = body('className')
   .notEmpty()
   .withMessage('Class name is required');
const admissionDateValidation = body('admissionDate')
   .notEmpty()
   .isISO8601()
   .toDate()
   .withMessage('Valid ISO8601 date is required');

// Create Student Route Validation
const createStudentValidation = [
   nameValidation,
   ageValidation,
   classNameValidation,
   admissionDateValidation
];

// Update Student Route Validation
const updateStudentValidation = [
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid student ID is required'),
   nameValidation,
   ageValidation,
   classNameValidation,
   admissionDateValidation
];

// Get All Students Route
router.get('/all', getAllStudents);

// Create Student Route
router.post('/create', createStudentValidation, createStudent);

// Update Student Route
router.put('/update/:id', updateStudentValidation, updateStudent);

// Delete Student Route
router.delete(
   '/delete/:id',
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid student ID is required'),
   deleteStudent
);

export default router;
