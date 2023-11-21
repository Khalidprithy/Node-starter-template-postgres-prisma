import { Document, Schema, model } from 'mongoose';

interface IEmployee extends Document {
   name: string;
   position: string;
   department: string;
   joinDate: Date;
   salary: string;
}

const employeeSchema = new Schema<IEmployee>({
   name: {
      type: String,
      required: true
   },
   position: {
      type: String,
      required: true
   },
   department: {
      type: String,
      required: true
   },
   joinDate: {
      type: Date,
      required: true
   },
   salary: {
      type: String,
      required: true
   }
});

const EmployeeModel = model<IEmployee>('Employee', employeeSchema);

export default EmployeeModel;
