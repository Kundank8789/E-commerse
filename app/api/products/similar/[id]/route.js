import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // ✅ CRITICAL FIX: Await params before accessing
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 4;

    // Get current product
    const currentProduct = await Product.findById(id)
      .populate('categories', 'name')
      .lean();

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get category IDs
    const categoryIds = currentProduct.categories?.map(cat => cat._id) || [];

    // Build query for similar products
    const query = {
      _id: { $ne: id },
      isActive: true,
      status: 'active',
    };

    // Priority 1: Same categories
    if (categoryIds.length > 0) {
      query.categories = { $in: categoryIds };
    }

    // Priority 2: Price range (±30%)
    const priceRange = currentProduct.price * 0.3;
    query.price = {
      $gte: Math.max(0, currentProduct.price - priceRange),
      $lte: currentProduct.price + priceRange,
    };

    let similarProducts = [];

    // Try with both category and price filters
    similarProducts = await Product.find(query)
      .limit(limit)
      .select('name price images rating description mrp categories slug')
      .populate('categories', 'name')
      .lean();

    // If not enough, remove price filter
    if (similarProducts.length < limit) {
      delete query.price;
      const additionalProducts = await Product.find(query)
        .limit(limit)
        .select('name price images rating description mrp categories slug')
        .populate('categories', 'name')
        .lean();
      
      const existingIds = new Set(similarProducts.map(p => p._id.toString()));
      const uniqueAdditional = additionalProducts.filter(
        p => !existingIds.has(p._id.toString())
      );
      similarProducts = [...similarProducts, ...uniqueAdditional];
    }

    // If still not enough, get random products
    if (similarProducts.length < limit) {
      const randomQuery = {
        _id: { $ne: id },
        isActive: true,
        status: 'active',
      };
      const randomProducts = await Product.find(randomQuery)
        .limit(limit - similarProducts.length)
        .select('name price images rating description mrp categories slug')
        .populate('categories', 'name')
        .lean();
      
      const existingIds = new Set(similarProducts.map(p => p._id.toString()));
      const uniqueRandom = randomProducts.filter(
        p => !existingIds.has(p._id.toString())
      );
      similarProducts = [...similarProducts, ...uniqueRandom];
    }

    // Shuffle for variety
    const shuffled = similarProducts.sort(() => 0.5 - Math.random());

    // Format response
    const formattedProducts = shuffled.map(product => ({
      ...product,
      _id: product._id.toString(),
      categories: product.categories?.map(cat => cat.name) || [],
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar products' },
      { status: 500 }
    );
  }
}