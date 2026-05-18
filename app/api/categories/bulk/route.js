import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function POST(req) {
  try {
    await connectDB();
    const { categories } = await req.json();

    if (!categories || !Array.isArray(categories)) {
      return Response.json({ error: "Categories array is required" }, { status: 400 });
    }

    const results = {
      success: [],
      failed: [],
    };

    for (const catName of categories) {
      try {
        // Generate slug
        let slug = catName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Check if exists
        let existingSlug = await Category.findOne({ slug });
        let counter = 1;
        const originalSlug = slug;
        while (existingSlug) {
          slug = `${originalSlug}-${counter}`;
          existingSlug = await Category.findOne({ slug });
          counter++;
        }

        const category = await Category.create({
          name: catName,
          slug: slug,
          icon: "📦",
        });

        results.success.push(category);
      } catch (error) {
        results.failed.push({ name: catName, error: error.message });
      }
    }

    return Response.json({
      success: true,
      message: `${results.success.length} categories added, ${results.failed.length} failed`,
      results,
    });

  } catch (error) {
    console.error("BULK ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}