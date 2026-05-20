import mongoose from "mongoose";

// Global cache for serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // Return cached connection if exists
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  // If no cached promise, create new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5, // Limit connection pool for serverless
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
      family: 4, // Use IPv4, skip IPv6
    };

    console.log("Creating new MongoDB connection...");
    
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB Connected ✅");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        cached.promise = null; // Reset cache on error
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
};

// Optional: Add connection event listeners
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  cached.conn = null;
  cached.promise = null;
});