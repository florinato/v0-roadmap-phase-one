import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get auth user from request header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user from Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const state = formData.get('state') as string;
    const imageFile = formData.get('image') as File | null;

    // Validate inputs
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Upload image if provided
    if (imageFile) {
      const timestamp = Date.now();
      const fileName = `${user.id}/${timestamp}-${imageFile.name}`;
      const buffer = await imageFile.arrayBuffer();

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('product-images')
        .upload(fileName, buffer, {
          contentType: imageFile.type,
        });

      if (uploadError) {
        console.error('[v0] Image upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 400 }
        );
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    // Create product in database
    const { data, error } = await supabase
      .from('products')
      .insert({
        seller_id: user.id,
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
