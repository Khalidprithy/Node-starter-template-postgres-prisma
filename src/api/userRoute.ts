// src/api/userRoute.ts

import express from 'express';
import { body } from 'express-validator';
import {
   changePassword,
   createUser,
   deleteUser,
   getAllUsers,
   login,
   updateUser
} from '../controllers/userController';

const router = express.Router();

// Common validation middleware
const emailValidation = body('email')
   .isEmail()
   .withMessage('Invalid email format');
const passwordValidation = body('password')
   .notEmpty()
   .withMessage('Password is required');
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const imageValidation = body('image')
   .optional()
   .isURL()
   .withMessage('Invalid image URL format');
const designationValidation = body('designation')
   .optional()
   .notEmpty()
   .withMessage('Designation is required');
const newPasswordValidation = body('newPassword')
   .isLength({ min: 6 })
   .withMessage('New password must be at least 6 characters long');

// Validation middleware for create user route
const createUserValidation = [
   nameValidation,
   emailValidation,
   passwordValidation
   // Add more validation rules as needed
];

// Validation middleware for login route
const loginValidation = [emailValidation, passwordValidation];

// Validation middleware for update user route
const updateUserValidation = [
   nameValidation,
   imageValidation,
   designationValidation
   // Add more validation rules as needed
];

// Validation middleware for change password
const changePasswordValidation = [passwordValidation, newPasswordValidation];

// Validation middleware for delete user route
const deleteUserValidation = [emailValidation, passwordValidation];

router.get('/all', getAllUsers);
router.post('/create', createUserValidation, createUser);
router.post('/login', loginValidation, login);
router.put('/update/:id', updateUserValidation, updateUser);
router.post('/change-password/:id', changePasswordValidation, changePassword);
router.delete('/delete', deleteUserValidation, deleteUser);

export default router;
