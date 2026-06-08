import { createClient } from '@supabase/supabase-js';
import { mockProducts, mockSellers, mockConversations, mockUserReviews } from '@/lib/mockData';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[v0] Supabase credentials missing');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// ============================================
// AUTENTICACIÓN
// ============================================

export async function signupWithEmail(name, email, password) {
  try {
    // Use serverless endpoint for signup to avoid client-side rate limits
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || 'Signup failed';
      
      // Provide user-friendly error messages
      if (errorMessage.includes('rate limit')) {
        throw new Error('Too many signup attempts. Please wait a few minutes and try again.');
      }
      if (errorMessage.includes('invalid email')) {
        throw new Error('Invalid email address. Please use a valid email format.');
      }
      if (errorMessage.includes('already registered')) {
        throw new Error('This email is already registered. Please use a different email or login.');
      }
      
      throw new Error(errorMessage);
    }

    console.log('[v0] User signed up successfully');
    return data.user;
  } catch (error) {
    console.error('[v0] Signup error:', error?.message || error);
    throw new Error(error?.message || 'Signup failed');
  }
}

export async function loginWithEmail(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[v0] Supabase login error:', error?.message);
      throw error;
    }

    return data.user;
  } catch (error) {
    console.error('[v0] Login error:', error?.message);
    throw new Error(error?.message || 'Login failed');
  }
}

export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('[v0] User logged out successfully');
  } catch (error) {
    console.error('[v0] Logout error:', error?.message || error);
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('[v0] Error getting current user:', error?.message || error);
    return null;
  }
}

// ============================================
// USUARIOS
// ============================================

export async function getCurrentUserData(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[v0] Error fetching user data:', error?.message || error);
    return null;
  }
}

export async function getUserById(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[v0] Error fetching user by ID:', error?.message || error);
    return null;
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[v0] Error updating user profile:', error?.message || error);
    throw new Error(error?.message || 'Update failed');
  }
}

// ============================================
// PRODUCTOS
// ============================================

export async function getProducts(filters = {}) {
  try {
    let query = supabase.from('products').select('*');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.state) {
      query = query.eq('state', filters.state);
    }

    if (filters.sellerId) {
      query = query.eq('seller_id', filters.sellerId);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('[v0] Error fetching products:', error?.message || error);
    return [];
  }
}

export async function getProductById(productId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[v0] Error fetching product:', error?.message || error);
    return null;
  }
}

export async function createProduct(product) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[v0] Error creating product:', error?.message || error);
    throw new Error(error?.message || 'Create failed');
  }
}

export async function updateProduct(productId, updates) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[v0] Error updating product:', error?.message || error);
    throw new Error(error?.message || 'Update failed');
  }
}

export async function deleteProduct(productId) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;

    console.log('[v0] Product deleted successfully');
  } catch (error) {
    console.error('[v0] Error deleting product:', error?.message || error);
    throw new Error(error?.message || 'Delete failed');
  }
}

// ============================================
// MENSAJES
// ============================================

export async function getConversations(userId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group messages by conversation
    const conversations = {};
    for (const msg of data || []) {
      const conversationId = msg.buyer_id === userId ? msg.seller_id : msg.buyer_id;
      if (!conversations[conversationId]) {
        conversations[conversationId] = [];
      }
      conversations[conversationId].push(msg);
    }

    return conversations;
  } catch (error) {
    console.error('[v0] Error fetching conversations:', error?.message || error);
    return {};
  }
}

export async function sendMessage(buyerId, sellerId, productId, content) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          buyer_id: buyerId,
          seller_id: sellerId,
          product_id: productId,
          content,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[v0] Error sending message:', error?.message || error);
    throw new Error(error?.message || 'Send failed');
  }
}

// ============================================
// TRANSACCIONES
// ============================================

export async function getUserTransactions(userId) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('[v0] Error fetching transactions:', error?.message || error);
    return [];
  }
}

export async function createTransaction(buyerId, sellerId, productId, amount) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          buyer_id: buyerId,
          seller_id: sellerId,
          product_id: productId,
          amount,
          status: 'completed',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[v0] Error creating transaction:', error?.message || error);
    throw new Error(error?.message || 'Transaction failed');
  }
}

// ============================================
// REVIEWS
// ============================================

export async function getUserReviews(userId) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewed_user_id', userId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('[v0] Error fetching reviews:', error?.message || error);
    return [];
  }
}

export async function getConversationMessages(buyerId, sellerId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(buyer_id.eq.${buyerId},seller_id.eq.${sellerId}),and(buyer_id.eq.${sellerId},seller_id.eq.${buyerId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((msg) => ({
      id: msg.id,
      senderId: msg.buyer_id,
      text: msg.content,
      timestamp: new Date(msg.created_at),
    }));
  } catch (error) {
    console.error('[v0] Error fetching conversation messages:', error?.message || error);
    return [];
  }
}

export async function getUserProducts(userId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('[v0] Error fetching user products:', error?.message || error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, users:seller_id(name, avatar_url, rating)')
      .eq('state', 'en_venta')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      state: product.state,
      image_url: product.image_url,
      seller_id: product.seller_id,
      seller_name: product.users?.name || 'Vendedor',
      seller_avatar: product.users?.avatar_url || '',
      seller_rating: product.users?.rating || 5.0,
      created_at: product.created_at,
    }));
  } catch (error) {
    console.error('[v0] Error fetching products:', error?.message || error);
    return [];
  }
}

export async function getProductsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, users:seller_id(name, avatar_url, rating)')
      .eq('category', category)
      .eq('state', 'en_venta')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      state: product.state,
      image_url: product.image_url,
      seller_id: product.seller_id,
      seller_name: product.users?.name || 'Vendedor',
      seller_avatar: product.users?.avatar_url || '',
      seller_rating: product.users?.rating || 5.0,
      created_at: product.created_at,
    }));
  } catch (error) {
    console.error('[v0] Error fetching products by category:', error?.message || error);
    return [];
  }
}

export async function getProductById(productId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, users:seller_id(name, avatar_url, rating, email)')
      .eq('id', productId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      state: data.state,
      image_url: data.image_url,
      seller_id: data.seller_id,
      seller_name: data.users?.name || 'Vendedor',
      seller_avatar: data.users?.avatar_url || '',
      seller_rating: data.users?.rating || 5.0,
      seller_email: data.users?.email || '',
      created_at: data.created_at,
    };
  } catch (error) {
    console.error('[v0] Error fetching product:', error?.message || error);
    return null;
  }
}

export async function deleteProduct(productId, userId) {
  try {
    // Verify user owns the product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', productId)
      .single();

    if (fetchError || product.seller_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('[v0] Error deleting product:', error?.message || error);
    throw new Error(error?.message || 'Delete failed');
  }
}

export async function updateProductState(productId, state, userId) {
  try {
    // Verify user owns the product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', productId)
      .single();

    if (fetchError || product.seller_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('products')
      .update({ state })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[v0] Error updating product state:', error?.message || error);
    throw new Error(error?.message || 'Update failed');
  }
}

