import { NextFunction, Request, Response } from 'express';
import Blog from '../models/Blog';

export const getAllBlogs = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const blogs = await Blog.find();
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

      const newBlog = new Blog({
         title,
         author,
         date,
         views,
         comments
      });

      const savedBlog = await newBlog.save();
      res.status(201).json({ success: true, data: savedBlog });
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

      // Validate that the blog with the given ID exists
      const existingBlog = await Blog.findById(id);
      if (!existingBlog) {
         return res
            .status(404)
            .json({ success: false, error: 'Blog not found' });
      }

      // Update blog fields
      existingBlog.title = title;
      existingBlog.author = author;
      existingBlog.date = date;
      existingBlog.views = views;
      existingBlog.comments = comments;

      const updatedBlog = await existingBlog.save();
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

      // Validate that the blog with the given ID exists
      const existingBlog = await Blog.findById(id);
      if (!existingBlog) {
         return res
            .status(404)
            .json({ success: false, error: 'Blog not found' });
      }

      await existingBlog.deleteOne();
      res.status(204).send({
         success: true,
         message: 'Blog deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
