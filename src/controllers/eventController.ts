import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllEvents = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
   try {
      const events = await prisma.event.findMany();
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

      const newEvent = await prisma.event.create({
         data: {
            title,
            start,
            end
         }
      });

      res.status(201).json({ success: true, data: newEvent });
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

      const updatedEvent = await prisma.event.update({
         where: { id: parseInt(id, 10) },
         data: {
            title,
            start,
            end
         }
      });

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

      await prisma.event.delete({
         where: { id: parseInt(id, 10) }
      });

      res.status(204).send({
         success: true,
         message: 'Event deleted successfully'
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
};
