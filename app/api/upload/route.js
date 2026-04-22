import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 🔥 Convert file to base64 (more stable than stream)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // 🔥 Upload directly
    const result = await cloudinary.uploader.upload(base64, {
      folder: "ecommerce",
    });

    return Response.json({
      url: result.secure_url,
    });

  } catch (error) {
    console.error("UPLOAD FAILED:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}