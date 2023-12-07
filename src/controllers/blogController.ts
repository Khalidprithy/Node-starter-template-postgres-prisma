import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllBlogs = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const blogs = await prisma.blog.findMany();
      res.status(200).json({ success: true, data: blogs });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const createBlog = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { title, author, date, views, comments } = req.body;

      const newBlog = await prisma.blog.create({
         data: {
            title,
            author,
            date,
            views,
            comments
         }
      });

      res.status(201).json({ success: true, data: newBlog });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const updateBlog = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;
      const { title, author, date, views, comments } = req.body;

      // Validate that the blog ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res
            .status(400)
            .json({ success: false, error: 'Invalid blog ID' });
      }

      // Update blog fields
      const updatedBlog = await prisma.blog.update({
         where: {
            id: parseInt(id, 10)
         },
         data: {
            title,
            author,
            date,
            views,
            comments
         }
      });

      res.status(200).json({ success: true, data: updatedBlog });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const deleteBlog = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;

      // Validate that the blog ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res
            .status(400)
            .json({ success: false, error: 'Invalid blog ID' });
      }

      // Delete blog
      await prisma.blog.delete({
         where: {
            id: parseInt(id, 10)
         }
      });

      res.status(204).send({
         success: true,
         message: 'Blog deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
