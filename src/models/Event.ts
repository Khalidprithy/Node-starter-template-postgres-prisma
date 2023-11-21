import { Document, Schema, model } from 'mongoose';

interface IEvent extends Document {
   title: string;
   start: Date;
   end: Date;
}

const eventSchema = new Schema<IEvent>({
   title: {
      type: String,
      required: true
   },
   start: {
      type: Date,
      required: true
   },
   end: {
      type: Date,
      required: true
   }
});

const EventModel = model<IEvent>('Event', eventSchema);

export default EventModel;
