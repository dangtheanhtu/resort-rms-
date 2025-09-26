-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  room_type TEXT NOT NULL CHECK (room_type IN ('single', 'double', 'suite', 'deluxe')),
  price_per_night DECIMAL(10,2) NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[],
  description TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rooms
CREATE POLICY "Anyone can view available rooms" ON public.rooms
  FOR SELECT USING (is_available = true);

-- Staff can view all rooms
CREATE POLICY "Staff can view all rooms" ON public.rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('manager', 'receptionist')
    )
  );

-- Only managers can modify rooms
CREATE POLICY "Managers can modify rooms" ON public.rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );
