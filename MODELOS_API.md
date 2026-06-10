-- 1. LIMPIEZA TOTAL (Empezamos con cimientos perfectos)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP VIEW IF EXISTS public.public_profiles;
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.reviews;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.profiles;

-- 2. TABLA DE PERFILES (Se sincroniza sola con Auth, cero trabajo manual)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  name text,
  bio text DEFAULT 
'';

  avatar_url text DEFAULT 
'';

  rating numeric DEFAULT 5.0,
  reviews_count integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. TABLA PRODUCTS (Conectada a Profiles)
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  state text DEFAULT 'en_venta' CHECK (state IN ('en_venta', 'reservado', 'vendido')),
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. TABLA MESSAGES (Conectada a Profiles y Products)
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. TABLA REVIEWS (Conectada a Profiles)
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  reviewer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reviewed_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. TRIGGER AUTOMÁTICO (Crea el perfil en public.profiles al registrarse en Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Padre/Madre'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. SEGURIDAD (RLS) Y PRIVILEGIOS DE API (Evita el error 403 de raíz)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos de red de la API REST a las tablas
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Políticas RLS
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public products are readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can insert products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Participants can read messages" ON public.messages FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Participants can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- 8. FORZAR RECARGA DEL CACHÉ DE LA API (Elimina el error de relaciones de Supabase)
NOTIFY pgrst, 'reload schema';
