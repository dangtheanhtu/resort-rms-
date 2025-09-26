import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { CustomerDashboard } from "@/components/customer/customer-dashboard"

export default async function CustomerPage() {
  const profile = await requireRole(["customer", "manager", "receptionist"])
  const supabase = await createClient()

  // Fetch available rooms
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_available", true)
    .order("price_per_night", { ascending: true })

  // Fetch customer's bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      rooms (
        room_number,
        room_type,
        price_per_night
      )
    `)
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false })

  return <CustomerDashboard profile={profile} rooms={rooms || []} bookings={bookings || []} />
}
