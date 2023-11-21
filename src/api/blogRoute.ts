import express from 'express';
import { body, param } from 'express-validator';
import {
   createBlog,
   deleteBlog,
   getAllBlogs,
   updateBlog
} from '../controllers/blogController';

const router = express.Router();

// Common validation middleware
const titleValidation = body('title')
   .notEmpty()
   .withMessage('Title is required');
const authorValidation = body('author')
   .notEmpty()
   .withMessage('Author is required');
const dateValidation = body('date')
   .notEmpty()
   .isISO8601()
   .toDate()
   .withMessage('Valid ISO8601 date is required');
const viewsValidation = body('views')
   .notEmpty()
   .isInt()
   .withMessage('Valid views count is required');
const commentsValidation = body('comments')
   .notEmpty()
   .isInt()
   .withMessage('Valid comments count is required');

// Create Blog Route Validation
const createBlogValidation = [
   titleValidation,
   authorValidation,
   dateValidation,
   viewsValidation,
   commentsValidation
];

// Update Blog Route Validation
const updateBlogValidation = [
   param('id').notEmpty().isMongoId().withMessage('Valid blog ID is required'),
   titleValidation,
   authorValidation,
   dateValidation,
   viewsValidation,
   commentsValidation
];

// Get All Blogs Route
router.get('/all', getAllBlogs);

// Create Blog Route
router.post('/create', createBlogValidation, createBlog);

// Update Blog Route
router.put('/update/:id', updateBlogValidation, updateBlog);

// Delete Blog Route
router.delete(
   '/delete/:id',
   param('id').notEmpty().isMongoId().withMessage('Valid blog ID is required'),
   deleteBlog
);

export default router;
