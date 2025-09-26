-- Insert sample rooms
INSERT INTO public.rooms (room_number, room_type, price_per_night, capacity, amenities, description) VALUES
('101', 'single', 150.00, 1, ARRAY['WiFi', 'TV', 'AC'], 'Cozy single room with garden view'),
('102', 'single', 150.00, 1, ARRAY['WiFi', 'TV', 'AC'], 'Comfortable single room'),
('201', 'double', 250.00, 2, ARRAY['WiFi', 'TV', 'AC', 'Mini Bar'], 'Spacious double room with city view'),
('202', 'double', 250.00, 2, ARRAY['WiFi', 'TV', 'AC', 'Mini Bar'], 'Elegant double room'),
('301', 'suite', 450.00, 4, ARRAY['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony'], 'Luxury suite with ocean view'),
('302', 'deluxe', 350.00, 3, ARRAY['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'], 'Deluxe room with premium amenities');

-- Insert sample services
INSERT INTO public.services (name, description, price, category) VALUES
('Spa Massage', 'Relaxing full body massage', 120.00, 'spa'),
('Room Service', 'In-room dining service', 25.00, 'dining'),
('Airport Transfer', 'Transportation to/from airport', 50.00, 'transport'),
('Gym Access', 'Access to fitness center', 30.00, 'recreation'),
('Laundry Service', 'Professional laundry and dry cleaning', 40.00, 'other'),
('Pool Access', 'Access to swimming pool and pool bar', 20.00, 'recreation');
