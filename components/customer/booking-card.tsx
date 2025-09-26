import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign } from "lucide-react"
import { format } from "date-fns"

interface BookingCardProps {
  booking: any
  onModify?: (booking: any) => void
  onViewDetails?: (booking: any) => void
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  checked_in: "bg-green-100 text-green-800",
  checked_out: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

export function BookingCard({ booking, onModify, onViewDetails }: BookingCardProps) {
  const checkInDate = new Date(booking.check_in_date)
  const checkOutDate = new Date(booking.check_out_date)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Room {booking.rooms.room_number}
          </CardTitle>
          <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
            {booking.status.replace("_", " ")}
          </Badge>
        </div>
        <CardDescription className="capitalize">{booking.rooms.room_type} Room</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(checkInDate, "MMM dd, yyyy")} - {format(checkOutDate, "MMM dd, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">${booking.total_amount}</span>
          </div>
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
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => onModify?.(booking)}
            >
              Modify
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => onViewDetails?.(booking)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
