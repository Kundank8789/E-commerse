// scripts/create-admin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function createAdmin() {
  try {
    console.log("\n🔐 Creating Admin...\n");
    
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error("❌ MONGODB_URI not found in .env file");
      process.exit(1);
    }
    
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("✅ Connected!");
    
    const email = "niwleofficial@gmail.com";
    const name = "shivam rajput";
    const password = "niwle@123shivam";
    
    const existingUser = await mongoose.connection.db
      .collection("users")
      .findOne({ email });
    
    if (existingUser) {
      console.log(`\n❌ User ${email} already exists!`);
      process.exit(1);
    }
    
    console.log("🔒 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await mongoose.connection.db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      phone: "",
      address: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log("\n✅ Admin created successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log("\n🔐 Login at: http://localhost:3000/admin/login\n");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();