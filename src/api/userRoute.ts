// src/api/userRoute.ts

import express from 'express';
import { body } from 'express-validator';
import {
   changePassword,
   createUser,
   deleteUser,
   login,
   updateUser
} from '../controllers/userController';

const router = express.Router();

// Validation middleware for create user route
const createUserValidation = [
   body('name').notEmpty().withMessage('Name is required'),
   body('email').isEmail().withMessage('Invalid email format'),
   body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
   // Add more validation rules as needed
];

// Validation middleware for login route
const loginValidation = [
   body('email').isEmail().withMessage('Invalid email format'),
   body('password').notEmpty().withMessage('Password is required')
];

// Validation middleware for update user route
const updateUserValidation = [
   body('name').optional().notEmpty().withMessage('Name is required'),
   body('image').optional().isURL().withMessage('Invalid image URL format'),
   body('designation')
      .optional()
      .notEmpty()
      .withMessage('Designation is required')
   // Add more validation rules as needed
];

// Validation middleware for change password
const changePasswordValidation = [
   body('oldPassword').notEmpty().withMessage('Old password is required'),
   body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
];

// Validation middleware for delete user route
const deleteUserValidation = [
   body('email').isEmail().withMessage('Invalid email format'),
   body('password').notEmpty().withMessage('Password is required')
];

router.post('/create', createUserValidation, createUser);
router.post('/login', loginValidation, login);
router.put('/update/:id', updateUserValidation, updateUser);
router.post('/change-password/:id', changePasswordValidation, changePassword);
router.delete('/delete', deleteUserValidation, deleteUser);

export default router;
