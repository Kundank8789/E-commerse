import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 16;

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

    let similarProducts = [];

    // ✅ STRATEGY 1: Get products with SAME categories (most relevant)
    if (categoryIds.length > 0) {
      const categoryQuery = {
        _id: { $ne: id },
        isActive: true,
        status: 'active',
        categories: { $in: categoryIds }
      };
      
      const categoryProducts = await Product.find(categoryQuery)
        .limit(limit)
        .select('name price images rating description mrp categories slug')
        .populate('categories', 'name')
        .lean();
      
      similarProducts = [...categoryProducts];
    }

    // ✅ STRATEGY 2: If not enough, add products with SIMILAR PRICE (±30%)
    if (similarProducts.length < limit) {
      const priceRange = currentProduct.price * 0.3;
      const priceQuery = {
        _id: { $ne: id },
        isActive: true,
        status: 'active',
        price: {
          $gte: Math.max(0, currentProduct.price - priceRange),
          $lte: currentProduct.price + priceRange,
        }
      };
      
      // Exclude already fetched products
      if (similarProducts.length > 0) {
        const existingIds = similarProducts.map(p => p._id.toString());
        priceQuery._id = { 
          $ne: id,
          $nin: existingIds 
        };
      }
      
      const priceProducts = await Product.find(priceQuery)
        .limit(limit - similarProducts.length)
        .select('name price images rating description mrp categories slug')
        .populate('categories', 'name')
        .lean();
      
      similarProducts = [...similarProducts, ...priceProducts];
    }

    // ✅ STRATEGY 3: If still not enough, get ANY OTHER products
    if (similarProducts.length < limit) {
      const randomQuery = {
        _id: { $ne: id },
        isActive: true,
        status: 'active',
      };
      
      if (similarProducts.length > 0) {
        const existingIds = similarProducts.map(p => p._id.toString());
        randomQuery._id = { 
          $ne: id,
          $nin: existingIds 
        };
      }
      
      const randomProducts = await Product.find(randomQuery)
        .limit(limit - similarProducts.length)
        .select('name price images rating description mrp categories slug')
        .populate('categories', 'name')
        .lean();
      
      similarProducts = [...similarProducts, ...randomProducts];
    }

    // ✅ STRATEGY 4: If STILL not enough (less than 16 products in DB), duplicate what we have
    if (similarProducts.length < limit && similarProducts.length > 0) {
      const originalLength = similarProducts.length;
      while (similarProducts.length < limit) {
        const duplicateIndex = similarProducts.length % originalLength;
        const dupProduct = { 
          ...similarProducts[duplicateIndex],
          _id: similarProducts[duplicateIndex]._id + '_dup_' + similarProducts.length
        };
        similarProducts.push(dupProduct);
      }
    }

    // Shuffle for variety
    const shuffled = similarProducts.sort(() => 0.5 - Math.random());

    // Format response - ensure all IDs are strings
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