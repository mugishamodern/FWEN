-- FWEN Supabase Schema
-- Run all queries in this file in your Supabase SQL editor (https://app.supabase.com/project/YOUR_PROJECT/sql/new)

-- ===== Enable RLS enforcement =====
ALTER DATABASE postgres SET app.jwt_secret TO 'your-super-secret-jwt-token-here';

-- ===== Create users table (extends Supabase auth) =====
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  user_type VARCHAR(20) CHECK (user_type IN ('customer', 'agent', 'admin')) DEFAULT 'customer',
  is_verified BOOLEAN DEFAULT FALSE,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===== Create districts table (bus route lookup) =====
CREATE TABLE IF NOT EXISTS public.districts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  region VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===== Create bus_routes table =====
CREATE TABLE IF NOT EXISTS public.bus_routes (
  id SERIAL PRIMARY KEY,
  origin_district_id INTEGER NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  destination_district_id INTEGER NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  base_cost NUMERIC(10, 2) NOT NULL,
  estimated_days INTEGER DEFAULT 3,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===== Create parcels table =====
CREATE TABLE IF NOT EXISTS public.parcels (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tracking_number VARCHAR(50) NOT NULL UNIQUE,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  origin_district_id INTEGER NOT NULL REFERENCES public.districts(id),
  destination_district_id INTEGER NOT NULL REFERENCES public.districts(id),
  bus_route_id INTEGER NOT NULL REFERENCES public.bus_routes(id),
  package_weight NUMERIC(8, 2) NOT NULL, -- kg
  package_dimensions VARCHAR(50), -- e.g., "30x20x15"
  package_description TEXT,
  priority VARCHAR(20) CHECK (priority IN ('standard', 'express', 'fragile')) DEFAULT 'standard',
  total_cost NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  parcel_status VARCHAR(50) CHECK (parcel_status IN ('pending', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled')) DEFAULT 'pending',
  assigned_agent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===== Create parcel_status_history table =====
CREATE TABLE IF NOT EXISTS public.parcel_status_history (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location TEXT,
  notes TEXT,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===== Create users_payment_methods table =====
CREATE TABLE IF NOT EXISTS public.users_payment_methods (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL, -- 'card', 'mobile_money', 'bank_transfer'
  is_default BOOLEAN DEFAULT FALSE,
  details JSONB, -- Encrypted or hashed payment details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===== Create indexes for performance =====
CREATE INDEX idx_parcels_sender_id ON public.parcels(sender_id);
CREATE INDEX idx_parcels_assigned_agent_id ON public.parcels(assigned_agent_id);
CREATE INDEX idx_parcels_tracking_number ON public.parcels(tracking_number);
CREATE INDEX idx_parcels_status ON public.parcels(parcel_status);
CREATE INDEX idx_parcel_status_history_parcel_id ON public.parcel_status_history(parcel_id);
CREATE INDEX idx_bus_routes_origin ON public.bus_routes(origin_district_id);
CREATE INDEX idx_bus_routes_destination ON public.bus_routes(destination_district_id);

-- ===== Enable Row Level Security (RLS) =====
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcel_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_routes ENABLE ROW LEVEL SECURITY;

-- ===== RLS Policies for users table =====
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ===== RLS Policies for parcels table =====
-- Users can view their own parcels
CREATE POLICY "Users can view own parcels" ON public.parcels
  FOR SELECT USING (auth.uid() = sender_id);

-- Agents can view assigned parcels
CREATE POLICY "Agents can view assigned parcels" ON public.parcels
  FOR SELECT USING (
    auth.uid() = assigned_agent_id
    OR
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'agent'
    )
  );

-- Admins can view all parcels
CREATE POLICY "Admins can view all parcels" ON public.parcels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Users can create parcels
CREATE POLICY "Users can create parcels" ON public.parcels
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Agents can update assigned parcels
CREATE POLICY "Agents can update assigned parcels" ON public.parcels
  FOR UPDATE USING (auth.uid() = assigned_agent_id)
  WITH CHECK (auth.uid() = assigned_agent_id);

-- ===== RLS Policies for parcel_status_history =====
-- Users can view history of own parcels
CREATE POLICY "Users can view own parcel history" ON public.parcel_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parcels WHERE id = parcel_id AND sender_id = auth.uid()
    )
  );

-- Agents can view history of assigned parcels
CREATE POLICY "Agents can view assigned parcel history" ON public.parcel_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parcels WHERE id = parcel_id AND assigned_agent_id = auth.uid()
    )
  );

-- Admins can view all history
CREATE POLICY "Admins can view all parcel history" ON public.parcel_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Agents/Admins can insert status updates
CREATE POLICY "Agents can insert status updates" ON public.parcel_status_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type IN ('agent', 'admin')
    )
  );

-- ===== RLS Policies for users_payment_methods =====
-- Users can view own payment methods
CREATE POLICY "Users can view own payment methods" ON public.users_payment_methods
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage own payment methods
CREATE POLICY "Users can manage own payment methods" ON public.users_payment_methods
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ===== RLS Policies for districts and bus_routes (public read) =====
CREATE POLICY "Authenticated users can view districts" ON public.districts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view bus routes" ON public.bus_routes
  FOR SELECT USING (auth.role() = 'authenticated');

-- ===== Demo Data =====
-- Insert sample districts
INSERT INTO public.districts (name, region) VALUES
  ('Accra', 'Greater Accra'),
  ('Kumasi', 'Ashanti'),
  ('Takoradi', 'Western'),
  ('Cape Coast', 'Central'),
  ('Tema', 'Greater Accra'),
  ('Sekondi', 'Western'),
  ('Adum', 'Ashanti'),
  ('Obuasi', 'Ashanti')
ON CONFLICT (name) DO NOTHING;

-- Insert sample bus routes (some key routes)
INSERT INTO public.bus_routes (origin_district_id, destination_district_id, base_cost, estimated_days) VALUES
  (1, 2, 35.00, 2),   -- Accra to Kumasi
  (1, 3, 45.00, 3),   -- Accra to Takoradi
  (1, 4, 25.00, 1),   -- Accra to Cape Coast
  (1, 5, 5.00, 1),    -- Accra to Tema
  (2, 1, 35.00, 2),   -- Kumasi to Accra
  (2, 6, 50.00, 3),   -- Kumasi to Sekondi
  (3, 1, 45.00, 3),   -- Takoradi to Accra
  (5, 2, 40.00, 2)    -- Tema to Kumasi
ON CONFLICT (origin_district_id, destination_district_id) DO NOTHING;
