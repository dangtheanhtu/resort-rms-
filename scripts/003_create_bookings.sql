-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')) DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure check-out is after check-in
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Customers can view their own bookings" ON public.bookings
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update their own pending bookings" ON public.bookings
  FOR UPDATE USING (customer_id = auth.uid() AND status = 'pending');

-- Staff can view and modify all bookings
CREATE POLICY "Staff can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('manager', 'receptionist')
    )
  );

CREATE POLICY "Staff can modify all bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('manager', 'receptionist')
    )
  );
