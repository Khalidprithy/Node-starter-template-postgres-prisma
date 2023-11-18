// src/controllers/userController.ts
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

export const createUser = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   // Validate input using express-validator
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
   }

   const { name, email, password, role, image, designation } = req.body;

   try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const userModel = new UserModel({
         name,
         email,
         password: hashedPassword,
         role,
         image,
         designation
      });

      const savedUser = await userModel.save();

      // (access token and refresh token)
      const accessToken = jwt.sign(
         { userId: savedUser._id, email: savedUser.email },
         process.env.JWT_SECRET as string,
         { expiresIn: '1h' } // 1 hour
      );

      const refreshToken = jwt.sign(
         { userId: savedUser._id, email: savedUser.email },
         process.env.JWT_SECRET_REFRESH as string,
         { expiresIn: '7d' } // 7 days
      );

      res.json({
         success: true,
         accessToken,
         refreshToken,
         user: {
            name: savedUser.name,
            email: savedUser.email,
            image: savedUser.image,
            role: savedUser.role
         }
      });
   } catch (error) {
      console.error('Error saving user to MongoDB:', error);
      next(error);
   }
};

export const login = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   // Validate input using express-validator
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
   }

   const { email, password } = req.body;

   try {
      // Find the user
      const user = await UserModel.findOne({ email });

      // user is not found
      if (!user) {
         return res
            .status(401)
            .json({ success: false, error: 'Invalid credentials' });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return res
            .status(401)
            .json({ success: false, error: 'Invalid credentials' });
      }

      // (access token and refresh token)
      const accessToken = jwt.sign(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET as string,
         { expiresIn: '1h' } // 1 hour
      );

      const refreshToken = jwt.sign(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET_REFRESH as string,
         { expiresIn: '7d' } // 7 days
      );

      res.json({
         success: true,
         accessToken,
         refreshToken,
         user: {
            name: user.name,
            email: user.email,
            image: user.image
         }
      });
   } catch (error) {
      console.error('Error during login:', error);
      next(error);
   }
};

export const updateUser = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   // Validate input using express-validator
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
   }

   const userId = req.params.id;
   const { name, image, designation } = req.body;

   try {
      // Find the user
      const user = await UserModel.findById(userId);

      // user is not found
      if (!user) {
         return res
            .status(404)
            .json({ success: false, error: 'User not found' });
      }

      user.name = name || user.name;
      user.image = image || user.image;
      user.designation = designation || user.designation;
      await user.save();

      res.json({
         success: true,
         user: {
            name: user.name,
            email: user.email,
            image: user.image,
            designation: user.designation
         }
      });
   } catch (error) {
      console.error('Error updating user:', error);
      next(error);
   }
};

export const changePassword = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   // Validate input using express-validator
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
   }

   const userId = req.params.id;
   const { oldPassword, newPassword } = req.body;

   try {
      // Find the user
      const user = await UserModel.findById(userId);

      // user is not found
      if (!user) {
         return res
            .status(404)
            .json({ success: false, error: 'User not found' });
      }

      // Compare old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
         return res
            .status(401)
            .json({ success: false, error: 'Invalid old password' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      user.password = hashedNewPassword;
      await user.save();

      // (access token)
      const accessToken = jwt.sign(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET as string,
         { expiresIn: '1h' } // 1 hour
      );

      res.json({
         success: true,
         accessToken,
         user: {
            name: user.name,
            email: user.email,
            image: user.image
         }
      });
   } catch (error) {
      console.error('Error changing password:', error);
      next(error);
   }
};

export const getAllUsers = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const users = await UserModel.find({}, { password: 0, __v: 0 });

      res.json({ success: true, users });
   } catch (error) {
      console.error('Error getting all users:', error);
      next(error);
   }
};

export const deleteUser = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   // Validate input using express-validator
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
   }
   const { email, password } = req.body;

   try {
      // Find the user
      const user = await UserModel.findOne({ email });

      // user is not found
      if (!user) {
         return res
            .status(404)
            .json({ success: false, error: 'User not found' });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return res
            .status(401)
            .json({ success: false, error: 'Invalid password' });
      }

      // Delete user
      await UserModel.findByIdAndDelete(user._id);

      res.json({ success: true, message: 'User deleted successfully' });
   } catch (error) {
      console.error('Error deleting user:', error);
      next(error);
   }
};
