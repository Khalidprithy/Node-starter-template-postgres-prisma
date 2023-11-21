import { NextFunction, Request, Response } from 'express';
import Event from '../models/Event';

export const getAllEvents = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const events = await Event.find();
      res.status(200).json({ success: true, data: events });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const createEvent = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { title, start, end } = req.body;

      const newEvent = new Event({
         title,
         start,
         end
      });

      const savedEvent = await newEvent.save();
      res.status(201).json({ success: true, data: savedEvent });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const updateEvent = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;
      const { title, start, end } = req.body;

      // Validate that the event ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res
            .status(400)
            .json({ success: false, error: 'Invalid event ID' });
      }

      // Validate that the event with the given ID exists
      const existingEvent = await Event.findById(id);
      if (!existingEvent) {
         return res
            .status(404)
            .json({ success: false, error: 'Event not found' });
      }

      // Update event fields
      existingEvent.title = title;
      existingEvent.start = start;
      existingEvent.end = end;

      const updatedEvent = await existingEvent.save();
      res.status(200).json({ success: true, data: updatedEvent });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const deleteEvent = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const { id } = req.params;

      // Validate that the event ID is valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res
            .status(400)
            .json({ success: false, error: 'Invalid event ID' });
      }

      // Validate that the event with the given ID exists
      const existingEvent = await Event.findById(id);
      if (!existingEvent) {
         return res
            .status(404)
            .json({ success: false, error: 'Event not found' });
      }

      await existingEvent.deleteOne();
      res.status(204).send({
         success: true,
         message: 'Event deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
