// src/api/userRoute.ts

import express from 'express';
import { body } from 'express-validator';
import {
   changePassword,
   createUser,
   deleteUser,
   getAllUsers,
   login,
   logout,
   refreshAccessToken,
   updateUser,
   userProfile
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

// Create User Route Validation
const createUserValidation = [
   nameValidation,
   emailValidation,
   passwordValidation
];

// login Route Validation
const loginValidation = [emailValidation, passwordValidation];

// login Route Validation
const logoutValidation = [emailValidation];

// Update User Route Validation
const updateUserValidation = [
   nameValidation,
   imageValidation,
   designationValidation
];

// Change Password Route Validation
const changePasswordValidation = [passwordValidation, newPasswordValidation];

// Delete User Route Validation
const deleteUserValidation = [emailValidation, passwordValidation];

router.post('/create', createUserValidation, createUser);
router.post('/login', loginValidation, login);
router.post('/logout', logoutValidation, logout);
router.get('/all', getAllUsers);
router.get('/profile/:id', userProfile);
router.put('/update/:id', updateUserValidation, updateUser);
router.post('/change-password/:id', changePasswordValidation, changePassword);
router.delete('/delete', deleteUserValidation, deleteUser);
router.post('/refresh-token', refreshAccessToken);

export default router;
