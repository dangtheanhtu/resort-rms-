import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ManagerDashboard } from "@/components/manager/manager-dashboard"

export default async function ManagerPage() {
  const profile = await requireRole(["manager"])
  const supabase = await createClient()

  // Fetch comprehensive data for analytics
  const [
    { data: bookings },
    { data: rooms },
    { data: payments },
    { data: services },
    { data: profiles },
    { data: bookingServices },
  ] = await Promise.all([
    supabase.from("bookings").select(`
      *,
      profiles!bookings_customer_id_fkey (
        full_name,
        email,
        phone
      ),
      rooms (
        room_number,
        room_type,
        price_per_night
      )
    `),
    supabase.from("rooms").select("*"),
    supabase.from("payments").select(`
      *,
      bookings (
        customer_id,
        check_in_date,
        check_out_date
      )
    `),
    supabase.from("services").select("*"),
    supabase.from("profiles").select("*"),
    supabase.from("booking_services").select(`
      *,
      services (
        name,
        price,
        category
      ),
      bookings (
        check_in_date,
        check_out_date
      )
    `),
  ])

  return (
    <ManagerDashboard
      profile={profile}
      bookings={bookings || []}
      rooms={rooms || []}
      payments={payments || []}
      services={services || []}
      profiles={profiles || []}
      bookingServices={bookingServices || []}
    />
  )
}
