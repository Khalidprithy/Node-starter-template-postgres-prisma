import { Document, Schema, model } from 'mongoose';

interface IStudent extends Document {
   name: string;
   age: number;
   className: string;
   admissionDate: Date;
}

const studentSchema = new Schema<IStudent>({
   name: {
      type: String,
      required: true
   },
   age: {
      type: Number,
      required: true
   },
   className: {
      type: String,
      required: true
   },
   admissionDate: {
      type: Date,
      required: true
   }
});

const StudentModel = model<IStudent>('Student', studentSchema);

export default StudentModel;
