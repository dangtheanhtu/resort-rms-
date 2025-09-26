"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CheckInOutListProps {
  bookings: any[]
  type: "checkin" | "checkout"
}

export function CheckInOutList({ bookings, type }: CheckInOutListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setIsLoading(bookingId)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error updating booking:", error)
    } finally {
      setIsLoading(null)
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No {type === "checkin" ? "check-ins" : "check-outs"} scheduled for today.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <h4 className="font-medium">{booking.profiles.full_name}</h4>
            <p className="text-sm text-muted-foreground">
              Room {booking.rooms.room_number} • {booking.rooms.room_type}
            </p>
            {booking.profiles.phone && <p className="text-xs text-muted-foreground">{booking.profiles.phone}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {booking.status.replace("_", " ")}
            </Badge>
            {type === "checkin" && booking.status !== "checked_in" && (
              <Button
                size="sm"
                onClick={() => updateBookingStatus(booking.id, "checked_in")}
                disabled={isLoading === booking.id}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading === booking.id ? "..." : "Check In"}
              </Button>
            )}
            {type === "checkout" && booking.status === "checked_in" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateBookingStatus(booking.id, "checked_out")}
                disabled={isLoading === booking.id}
                className="bg-transparent"
              >
                {isLoading === booking.id ? "..." : "Check Out"}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
