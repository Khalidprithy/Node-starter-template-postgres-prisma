// src/controllers/userController.ts
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

interface DecodedToken {
   userId: string;
   email: string;
}

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

      const userExists = await prisma.user.findUnique({
         where: {
            email: email
         }
      });

      if (userExists) {
         res.status(422).json({
            success: false,
            error: 'User with the same email already exists. Please choose a different email.'
         });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const refreshToken = generateToken(
         { name: name, email: email },
         process.env.JWT_SECRET_REFRESH as string,
         '7d'
      );

      const savedUser = await prisma.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
            role,
            image,
            designation,
            refreshToken
         }
      });

      // const savedUser = await userModel.save();

      const accessToken = generateToken(
         { userId: savedUser.id, email: savedUser.email },
         process.env.JWT_SECRET_ACCESS as string,
         '1h'
      );

      // Res with http only cookie token
      res.cookie('jwt', refreshToken, {
         httpOnly: true,
         maxAge: 24 * 60 * 60 * 1000
      });
      res.json({
         success: true,
         accessToken,
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
      const user = await prisma.user.findUnique({
         where: {
            email: email
         }
      });

      // user is not found or password is invalid
      if (!user || !(await bcrypt.compare(password, user.password))) {
         return res
            .status(401)
            .json({ success: false, error: 'Invalid email or password' });
      }

      // (access token and refresh token)
      const accessToken = generateToken(
         { userId: user.id, email: user.email },
         process.env.JWT_SECRET_ACCESS as string,
         '1h'
      );
      const refreshToken = generateToken(
         { name: user.name, email: user.email },
         process.env.JWT_SECRET_REFRESH as string,
         '7d'
      );

      // Update the user document with the new refresh token
      await prisma.user.update({
         where: {
            email: email
         },
         data: {
            refreshToken: refreshToken
         }
      });

      // Res with http only cookie token
      res.cookie('jwt', refreshToken, {
         httpOnly: true,
         maxAge: 24 * 60 * 60 * 1000
      });
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
      console.error('Error during login:', error);
      next(error);
   }
};

// ********************** Logout ********************** //
export const logout = async (
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
      // Clear the refresh token in the database
      const email = req.body.email;

      await prisma.user.update({
         where: {
            email: email
         },
         data: {
            refreshToken: undefined
         }
      });

      // Clear the JWT cookie on the client-side
      res.clearCookie('jwt');

      res.json({
         success: true,
         message: 'Logout successful'
      });
   } catch (error) {
      console.error('Error during logout:', error);
      next(error);
   }
};

// ********************** Token Refresh ********************** //
export const refreshAccessToken = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const cookies = req.cookies;

      if (!cookies?.jwt) {
         return res.status(401).json({
            success: false,
            error: 'Unauthorized: Missing refresh token'
         });
      }

      const refreshToken = cookies.jwt;

      // Find the user
      const foundUser = await prisma.user.findUnique({
         where: {
            refreshToken: refreshToken
         }
      });

      // Check if it's a valid user
      if (!foundUser) {
         return res.status(403).json({
            success: false,
            error: 'Forbidden access: User not found'
         });
      }

      // Verify the refresh token
      jwt.verify(
         refreshToken,
         process.env.JWT_SECRET_REFRESH as string,
         (err: any, decoded: any) => {
            if (err || foundUser.email !== decoded.email) {
               return res.status(403).json({
                  success: false,
                  error: 'Forbidden access: Invalid refresh token'
               });
            }

            // Extract userId and email from the decoded refresh token
            const { name, email } = decoded as {
               name: string;
               email: string;
            };

            // Generate a new access token
            const newAccessToken = generateToken(
               { name, email },
               process.env.JWT_SECRET_ACCESS as string,
               '1h'
            );

            res.json({
               success: true,
               accessToken: newAccessToken
            });
         }
      );
   } catch (error) {
      console.error('Error refreshing access token:', error);
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

   const userId = parseInt(req.params.id, 10);
   const { name, image, designation } = req.body;

   try {
      // Find the user
      const user = await prisma.user.findUnique({
         where: {
            id: userId
         }
      });

      // user is not found
      if (!user) {
         return res
            .status(404)
            .json({ success: false, error: 'User not found' });
      }

      // Update user fields
      const updatedUser = await prisma.user.update({
         where: {
            id: userId
         },
         data: {
            name: name || user.name,
            image: image || user.image,
            designation: designation || user.designation
         }
      });

      res.json({
         success: true,
         user: {
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
            designation: updatedUser.designation
         }
      });
   } catch (error) {
      console.error('Error updating user:', error);
      next(error);
   }
};

// ********************** Update Profile ********************** //
export const userProfile = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   // Express-validator
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
   }

   const userId = parseInt(req.params.id, 10);

   try {
      // Find the user
      const user = await prisma.user.findUnique({
         where: {
            id: userId
         }
      });

      // user is not found
      if (!user) {
         return res
            .status(404)
            .json({ success: false, error: 'User not found' });
      }

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
      console.error('Error finding user:', error);
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

      const userId = parseInt(req.params.id, 10); // Assuming userId is a number
      const { oldPassword, newPassword } = req.body;

      // Find the user
      const user = await prisma.user.findUnique({
         where: {
            id: userId
         }
      });

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
      const updatedUser = await prisma.user.update({
         where: {
            id: userId
         },
         data: {
            password: hashedNewPassword
         }
      });

      // (access token)
      const accessToken = generateToken(
         { userId: updatedUser.id, email: updatedUser.email },
         process.env.JWT_SECRET_ACCESS as string,
         '1h'
      );

      res.json({
         success: true,
         accessToken,
         user: {
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image
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
      const users = await prisma.user.findMany({
         select: {
            id: true,
            name: true,
            email: true,
            image: true,
            designation: true
         }
      });
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
      const user = await prisma.user.findUnique({
         where: {
            email: email
         }
      });

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
      await prisma.user.delete({
         where: {
            id: user.id
         }
      });

      res.json({ success: true, message: 'User deleted successfully' });
   } catch (error) {
      console.error('Error deleting user:', error);
      next(error);
   }
};
