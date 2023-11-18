// src/config/db.ts

import mongoose from 'mongoose';

const connectToDatabase = (): void => {
   try {
      // MongoDB connection
      const dbUri = process.env.MONGODB_URI || 'not-found';

      if (dbUri === 'not-found') {
         console.log(
            'Database URL not found. Please provide a valid MongoDB URI.'
         );
         return;
      }

      mongoose.connect(dbUri);

      const db = mongoose.connection;

      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
      db.once('open', () => {
         console.log('Connected to MongoDB');
      });
   } catch (error) {
      console.error('Error connecting to MongoDB:', error);
   }
};

export default connectToDatabase;
