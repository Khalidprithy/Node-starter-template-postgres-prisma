import { Document, Schema, model } from 'mongoose';

interface ICourse extends Document {
   courseName: string;
   instructor: string;
   duration: number;
   enrollmentCount: number;
   price: string;
}

const courseSchema = new Schema<ICourse>({
   courseName: {
      type: String,
      required: true
   },
   instructor: {
      type: String,
      required: true
   },
   duration: {
      type: Number,
      required: true
   },
   enrollmentCount: {
      type: Number,
      required: true
   },
   price: {
      type: String,
      required: true
   }
});

const CourseModel = model<ICourse>('Course', courseSchema);

export default CourseModel;
