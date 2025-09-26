-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('spa', 'dining', 'recreation', 'transport', 'other')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_services junction table
CREATE TABLE IF NOT EXISTS public.booking_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  service_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(booking_id, service_id, service_date)
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Managers can modify services" ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- RLS Policies for booking_services
CREATE POLICY "Customers can view their own booking services" ON public.booking_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND customer_id = auth.uid()
    )
  );

CREATE POLICY "Customers can add services to their bookings" ON public.booking_services
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND customer_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all booking services" ON public.booking_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('manager', 'receptionist')
    )
  );

CREATE POLICY "Staff can modify all booking services" ON public.booking_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('manager', 'receptionist')
    )
  );
