import { Document, Schema, model } from 'mongoose';

interface IBlog extends Document {
   title: string;
   author: string;
   date: Date;
   views: number;
   comments: number;
}

const blogSchema = new Schema<IBlog>({
   title: {
      type: String,
      required: true
   },
   author: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      required: true
   },
   views: {
      type: Number,
      required: true
   },
   comments: {
      type: Number,
      required: true
   }
});

const BlogModel = model<IBlog>('Blog', blogSchema);

export default BlogModel;
