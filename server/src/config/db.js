import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<typeof mongoose | null>}
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[DB Warning] MONGODB_URI is not set in environment variables. Database features will be unavailable.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[DB Success] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[DB Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn('[DB Notice] Server is running, but database operations will wait or fail until MongoDB is available.');
    return null;
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[DB Event] Disconnected from MongoDB.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[DB Event Error] MongoDB connection error: ${err.message}`);
});
