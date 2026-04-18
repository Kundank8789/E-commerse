import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// CREATE ORDER
export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const order = await Order.create(body);

  return Response.json(order);
}

// GET ORDERS
export async function GET() {
  await connectDB();

  const orders = await Order.find()
    .populate("items.product");

  return Response.json(orders);
}