import jwt from "jsonwebtoken";

const ADMIN = {
  email: "admin@gmail.com",
  password: "123456",
};

export async function POST(req) {
  const { email, password } = await req.json();

  if (email !== ADMIN.email || password !== ADMIN.password) {
    return Response.json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  return Response.json({ token });
}