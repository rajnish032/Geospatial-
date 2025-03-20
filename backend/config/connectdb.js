// import mongoose from 'mongoose';

// const connectDB = async (DATABASE_URL) => {
//   try {
//     const DB_OPTIONS = {
//       dbName: "Geospatial"
//     }
//     await mongoose.connect(DATABASE_URL, DB_OPTIONS)
//     console.log('Connected Successfully...')
//   } catch (error) {
//     console.log(error)
//   }
// }

// export default connectDB

import mongoose from 'mongoose';

const connectDB = async (DATABASE_URL) => {
  try {
    // Updated connection options without the deprecated ones
    const DB_OPTIONS = {
      dbName: "Geospatial",              // Database name
      serverSelectionTimeoutMS: 30000,   // Timeout for server selection
      socketTimeoutMS: 45000,           // Socket timeout for queries
      bufferCommands: false,            // Disable buffering if not needed
    };

    // Connect to the database
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log('Connected Successfully...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message || error);
  }
};

export default connectDB;
