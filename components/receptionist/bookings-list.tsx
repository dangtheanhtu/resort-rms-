"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, DollarSign, Phone, Mail, Search } from "lucide-react"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface BookingsListProps {
  bookings: any[]
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  checked_in: "bg-green-100 text-green-800",
  checked_out: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

export function BookingsList({ bookings }: BookingsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.rooms.room_number.includes(searchTerm) ||
      booking.profiles.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, room, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="checked_out">Checked Out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Grid */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {booking.profiles.full_name}
                </CardTitle>
                <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                  {booking.status.replace("_", " ")}
                </Badge>
              </div>
              <CardDescription>
                Room {booking.rooms.room_number} • {booking.rooms.room_type}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(booking.check_in_date), "MMM dd")} -{" "}
                    {format(new Date(booking.check_out_date), "MMM dd, yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">${booking.total_amount}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.profiles.email}</span>
                </div>

                {booking.profiles.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.profiles.phone}</span>
                  </div>
                )}
              </div>

              {booking.special_requests && (
                <div>
                  <p className="text-sm font-medium mb-1">Special Requests</p>
                  <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                </div>
              )}

              <div className="flex gap-2">
                {booking.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => updateBookingStatus(booking.id, "confirmed")}
                    disabled={isLoading === booking.id}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isLoading === booking.id ? "Confirming..." : "Confirm"}
                  </Button>
                )}
                {booking.status === "confirmed" && (
                  <Button
                    size="sm"
                    onClick={() => updateBookingStatus(booking.id, "checked_in")}
                    disabled={isLoading === booking.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading === booking.id ? "Checking In..." : "Check In"}
                  </Button>
                )}
                {booking.status === "checked_in" && (
                  <Button
                    size="sm"
                    onClick={() => updateBookingStatus(booking.id, "checked_out")}
                    disabled={isLoading === booking.id}
                    variant="outline"
                    className="bg-transparent"
                  >
                    {isLoading === booking.id ? "Checking Out..." : "Check Out"}
                  </Button>
                )}
                <Button variant="outline" size="sm" className="bg-transparent">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No bookings available at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
