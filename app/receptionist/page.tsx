import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ReceptionistDashboard } from "@/components/receptionist/receptionist-dashboard"

export default async function ReceptionistPage() {
  const profile = await requireRole(["receptionist", "manager"])
  const supabase = await createClient()

  // Fetch all bookings with customer and room details
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
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
    `)
    .order("check_in_date", { ascending: true })

  // Fetch all rooms
  const { data: rooms } = await supabase.from("rooms").select("*").order("room_number", { ascending: true })

  // Fetch today's check-ins and check-outs
  const today = new Date().toISOString().split("T")[0]

  const { data: todayCheckIns } = await supabase
    .from("bookings")
    .select(`
      *,
      profiles!bookings_customer_id_fkey (
        full_name,
        email,
        phone
      ),
      rooms (
        room_number,
        room_type
      )
    `)
    .eq("check_in_date", today)
    .in("status", ["confirmed", "pending"])

  const { data: todayCheckOuts } = await supabase
    .from("bookings")
    .select(`
      *,
      profiles!bookings_customer_id_fkey (
        full_name,
        email,
        phone
      ),
      rooms (
        room_number,
        room_type
      )
    `)
    .eq("check_out_date", today)
    .eq("status", "checked_in")

  return (
    <ReceptionistDashboard
      profile={profile}
      bookings={bookings || []}
      rooms={rooms || []}
      todayCheckIns={todayCheckIns || []}
      todayCheckOuts={todayCheckOuts || []}
    />
  )
}
