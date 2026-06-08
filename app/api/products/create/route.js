import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DEFAULT_PRODUCT_IMAGES = {
  libros: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop',
  ropa: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  mochilas: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  utiles: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
  tecnologia: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
};

export async function POST(request: NextRequest) {
  try {
    // Get current user from Supabase
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const state = formData.get('state') as string;

    // Validate inputs
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use default image based on category
    const imageUrl = DEFAULT_PRODUCT_IMAGES[category as keyof typeof DEFAULT_PRODUCT_IMAGES] || 
                     DEFAULT_PRODUCT_IMAGES.utiles;

    // Create product in database
    const { data, error } = await supabase
      .from('products')
      .insert({
        seller_id: userId,
        name,
        description,
        price,
        category,
        state,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('[v0] Product creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 400 }
      );
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
