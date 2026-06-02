// scripts/admin.mjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const email = "shivam@gmail.com";
const password = "123456";

await mongoose.connect(process.env.MONGODB_URI);

if (await mongoose.connection.db.collection("users").findOne({ email })) {
  console.log("Admin already exists!");
  process.exit();
}

await mongoose.connection.db.collection("users").insertOne({
  name: "shivam rajput",
  email,
  password: await bcrypt.hash(password, 10),
  role: "admin",
  phone: "",
  address: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log("✅ Admin created! Email:", email, "Password:", password);
process.exit();