-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  rating DECIMAL(2, 1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  state TEXT DEFAULT 'en_venta',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_messages_buyer_id ON messages(buyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_seller_id ON messages(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can view all public seller data
CREATE POLICY "Users can view seller data" ON users
  FOR SELECT USING (true);

-- Users can update their own data
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (true);

-- Users can insert their own products
CREATE POLICY "Users can insert products" ON products
  FOR INSERT WITH CHECK (auth.uid()::text = seller_id::text);

-- Users can update their own products
CREATE POLICY "Users can update their products" ON products
  FOR UPDATE USING (auth.uid()::text = seller_id::text);

-- Messages are readable by participants
CREATE POLICY "Messages are readable by participants" ON messages
  FOR SELECT USING (auth.uid()::text = buyer_id::text OR auth.uid()::text = seller_id::text);

-- Users can insert messages
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (auth.uid()::text = buyer_id::text OR auth.uid()::text = seller_id::text);

-- Transactions are readable by participants
CREATE POLICY "Transactions are readable by participants" ON transactions
  FOR SELECT USING (auth.uid()::text = buyer_id::text OR auth.uid()::text = seller_id::text);

-- Reviews are publicly readable
CREATE POLICY "Reviews are publicly readable" ON reviews
  FOR SELECT USING (true);

-- Users can insert reviews
CREATE POLICY "Users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid()::text = reviewer_id::text);
