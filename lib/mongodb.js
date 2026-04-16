import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  try {
    if (isConnected) return;

    const db = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("DB Error:", error);
  }
};