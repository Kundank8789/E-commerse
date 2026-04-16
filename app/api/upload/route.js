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

    // 🚨 IMPORTANT CHECK
    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file → buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ecommerce" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(buffer);
    });

    return Response.json({
      url: result.secure_url,
    });

  } catch (error) {
    console.error("UPLOAD FAILED:", error); // 👈 SEE ERROR IN TERMINAL
    return Response.json({ error: error.message }, { status: 500 });
  }
}