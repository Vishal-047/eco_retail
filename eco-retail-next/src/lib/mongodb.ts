import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}

// Utility to drop the old emailOrPhone index from users collection
export async function dropEmailOrPhoneIndex() {
  const conn = await connectToDatabase();
  try {
    await conn.connection.db.collection('users').dropIndex('emailOrPhone_1');
    console.log('Dropped index emailOrPhone_1');
  } catch (err) {
    console.error('Error dropping index:', err);
  }
} 