import express from 'express';
import { body, param } from 'express-validator';
import {
   createEmployee,
   deleteEmployee,
   getAllEmployees,
   updateEmployee
} from '../controllers/employeeController';

const router = express.Router();

// Common validation middleware
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const positionValidation = body('position')
   .notEmpty()
   .withMessage('Position is required');
const departmentValidation = body('department')
   .notEmpty()
   .withMessage('Department is required');
const joinDateValidation = body('joinDate')
   .notEmpty()
   .isISO8601()
   .toDate()
   .withMessage('Valid ISO8601 date is required');
const salaryValidation = body('salary')
   .notEmpty()
   .isCurrency()
   .withMessage('Valid currency format is required');

// Create Employee Route Validation
const createEmployeeValidation = [
   nameValidation,
   positionValidation,
   departmentValidation,
   joinDateValidation,
   salaryValidation
];

// Update Employee Route Validation
const updateEmployeeValidation = [
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid employee ID is required'),
   nameValidation,
   positionValidation,
   departmentValidation,
   joinDateValidation,
   salaryValidation
];

// Get All Employees Route
router.get('/all', getAllEmployees);

// Create Employee Route
router.post('/create', createEmployeeValidation, createEmployee);

// Update Employee Route
router.put('/update/:id', updateEmployeeValidation, updateEmployee);

// Delete Employee Route
router.delete(
   '/delete/:id',
   param('id')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid employee ID is required'),
   deleteEmployee
);

export default router;
