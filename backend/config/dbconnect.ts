import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
// Throw error if URI is missing
if (!MONGODB_URI) {
  throw new Error("No MONGODB_URI provided");
}

// Define cache structure for storing connection and promise
interface MongooseCache {
  conn: typeof mongoose | null;        // stores actual DB connection
  promise: Promise<typeof mongoose> | null; // stores ongoing connection promise
}

// Extend global object to include mongoose cache
declare global {
  var mongoose: MongooseCache;
}

// Get existing cache from global object
let cached = global.mongoose;

// If no cache exists, initialize it
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to connect to database
async function dbConnect() {

  // ✅ If connection already exists, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // ✅ If no connection is in progress, start one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  // ✅ Wait for connection to complete and store it
  cached.conn = await cached.promise;

  // Return the connected mongoose instance
  return cached.conn;
}

// Export function to use in other files
export default dbConnect;