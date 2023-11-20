// src/controllers/userController.ts
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

// Helpers
const generateToken = (payload: any, secret: string, expiresIn: string) => {
   return jwt.sign(payload, secret, { expiresIn });
};

// ********************** Registration ********************** //
export const createUser = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res
            .status(422)
            .json({ success: false, errors: errors.array() });
      }

      const { name, email, password, role, image, designation } = req.body;

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

      const accessToken = generateToken(
         { userId: savedUser._id, email: savedUser.email },
         process.env.JWT_SECRET as string,
         '1h'
      );
      const refreshToken = generateToken(
         { userId: savedUser._id, email: savedUser.email },
         process.env.JWT_SECRET_REFRESH as string,
         '7d'
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

// ********************** Login ********************** //
export const login = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res
            .status(422)
            .json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find the user
      const user = await UserModel.findOne({ email });

      // user is not found or password is invalid
      if (!user || !(await bcrypt.compare(password, user.password))) {
         return res
            .status(401)
            .json({ success: false, error: 'Invalid email or password' });
      }

      // (access token and refresh token)
      const accessToken = generateToken(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET as string,
         '1h'
      );
      const refreshToken = generateToken(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET_REFRESH as string,
         '7d'
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

// ********************** Update Profile ********************** //
export const updateUser = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   // Express-validator
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

// ********************** Change Password ********************** //
export const changePassword = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res
            .status(422)
            .json({ success: false, errors: errors.array() });
      }

      const userId = req.params.id;
      const { oldPassword, newPassword } = req.body;

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
      const accessToken = generateToken(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET as string,
         '1h'
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

// ********************** All Users ********************** //
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

// ********************** Delete User ********************** //
export const deleteUser = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   // Express-validator
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
