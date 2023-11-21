import { Document, Schema, model } from 'mongoose';

interface School {
   name: string;
   location: string;
   students: number;
   teachers: number;
   foundedYear: number;
}

interface SchoolDocument extends School, Document {}

const schoolSchema = new Schema<SchoolDocument>(
   {
      name: {
         type: String,
         required: true
      },
      location: {
         type: String,
         required: true
      },
      students: {
         type: Number,
         required: true
      },
      teachers: {
         type: Number,
         required: true
      },
      foundedYear: {
         type: Number,
         required: true
      }
   },
   { timestamps: true } // Add timestamps for createdAt and updatedAt
);

const SchoolModel = model<SchoolDocument>('School', schoolSchema);

export default SchoolModel;
