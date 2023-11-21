import express from 'express';
import { body, param } from 'express-validator';
import {
   createTeacher,
   deleteTeacher,
   getAllTeachers,
   updateTeacher
} from '../controllers/teacherController';

const router = express.Router();

// Common validation middleware
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const subjectValidation = body('subject')
   .notEmpty()
   .withMessage('Subject is required');
const qualificationValidation = body('qualification')
   .notEmpty()
   .withMessage('Qualification is required');
const experienceValidation = body('experience')
   .notEmpty()
   .isInt()
   .withMessage('Valid experience is required');
const contactInfoValidation = body('contactInfo')
   .notEmpty()
   .withMessage('Contact information is required');

// Create Teacher Route Validation
const createTeacherValidation = [
   nameValidation,
   subjectValidation,
   qualificationValidation,
   experienceValidation,
   contactInfoValidation
];

// Update Teacher Route Validation
const updateTeacherValidation = [
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid teacher ID is required'),
   nameValidation,
   subjectValidation,
   qualificationValidation,
   experienceValidation,
   contactInfoValidation
];

// Get All Teachers Route
router.get('/all', getAllTeachers);

// Create Teacher Route
router.post('/create', createTeacherValidation, createTeacher);

// Update Teacher Route
router.put('/update/:id', updateTeacherValidation, updateTeacher);

// Delete Teacher Route
router.delete(
   '/delete/:id',
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid teacher ID is required'),
   deleteTeacher
);

export default router;
