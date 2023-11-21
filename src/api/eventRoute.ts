import express from 'express';
import { body, param } from 'express-validator';
import {
   createEvent,
   deleteEvent,
   getAllEvents,
   updateEvent
} from '../controllers/eventController';

const router = express.Router();

// Common validation middleware
const titleValidation = body('title')
   .notEmpty()
   .withMessage('Title is required');
const startValidation = body('start')
   .notEmpty()
   .isISO8601()
   .toDate()
   .withMessage('Valid ISO8601 start date is required');
const endValidation = body('end')
   .notEmpty()
   .isISO8601()
   .toDate()
   .withMessage('Valid ISO8601 end date is required');

// Create Event Route Validation
const createEventValidation = [titleValidation, startValidation, endValidation];

// Update Event Route Validation
const updateEventValidation = [
   param('id').notEmpty().isMongoId().withMessage('Valid event ID is required'),
   titleValidation,
   startValidation,
   endValidation
];

// Get All Events Route
router.get('/all', getAllEvents);

// Create Event Route
router.post('/create', createEventValidation, createEvent);

// Update Event Route
router.put('/update/:id', updateEventValidation, updateEvent);

// Delete Event Route
router.delete(
   '/delete/:id',
   param('id').notEmpty().isMongoId().withMessage('Valid event ID is required'),
   deleteEvent
);

export default router;
