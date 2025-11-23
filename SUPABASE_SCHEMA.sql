-- Vélora E-Commerce Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shopping cart table
CREATE TABLE IF NOT EXISTS carts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products are readable by everyone
CREATE POLICY "Products are readable by everyone"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Carts policies
CREATE POLICY "Users can read their own cart"
  ON carts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart"
  ON carts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can read cart items from their cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add items to their cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can read order items from their orders"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample products
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('Luxury Silk Scarf', 'Premium Italian silk scarf with hand-rolled edges', 299.00, 25, 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=500', 'Accessories'),
('Designer Leather Handbag', 'Handcrafted leather tote with gold hardware', 1299.00, 12, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', 'Handbags'),
('Cashmere Sweater', 'Pure cashmere crew neck in classic black', 899.00, 18, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500', 'Clothing'),
('Diamond Stud Earrings', '18k white gold with brilliant-cut diamonds', 2499.00, 8, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', 'Jewelry'),
('Premium Sunglasses', 'Italian-made aviator sunglasses with UV protection', 599.00, 30, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 'Accessories'),
('Leather Ankle Boots', 'Hand-stitched Italian leather boots', 1199.00, 15, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500', 'Footwear'),
('Silk Evening Dress', 'Floor-length silk gown with beaded details', 1899.00, 6, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500', 'Clothing'),
('Gold Statement Necklace', '14k gold collar necklace with gemstone accents', 3299.00, 4, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', 'Jewelry'),
('Wool Tailored Blazer', 'Classic fit blazer in merino wool', 1599.00, 20, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', 'Clothing'),
('Luxury Watch', 'Swiss-made automatic watch with leather strap', 4999.00, 5, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Accessories');
