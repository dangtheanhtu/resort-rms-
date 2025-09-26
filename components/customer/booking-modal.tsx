"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Users } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface BookingModalProps {
  room: any
  isOpen: boolean
  onClose: () => void
  customerId: string
}

export function BookingModal({ room, isOpen, onClose, customerId }: BookingModalProps) {
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [specialRequests, setSpecialRequests] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || !room) return 0
    const nights = differenceInDays(checkOutDate, checkInDate)
    return nights * room.price_per_night
  }

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate || !room) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const totalAmount = calculateTotal()

      const { error } = await supabase.from("bookings").insert({
        customer_id: customerId,
        room_id: room.id,
        check_in_date: format(checkInDate, "yyyy-MM-dd"),
        check_out_date: format(checkOutDate, "yyyy-MM-dd"),
        total_amount: totalAmount,
        special_requests: specialRequests || null,
        status: "pending",
      })

      if (error) throw error

      onClose()
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!room) return null

  const nights = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0
  const totalAmount = calculateTotal()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Reserve {room.room_type} Room {room.room_number}
          </DialogTitle>
          <DialogDescription>Complete your booking details below</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="checkin">Check-in Date</Label>
              <Input
                id="checkin"
                type="date"
                value={checkInDate ? format(checkInDate, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined
                  setCheckInDate(date)
                }}
                min={format(new Date(), "yyyy-MM-dd")}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="checkout">Check-out Date</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOutDate ? format(checkOutDate, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined
                  setCheckOutDate(date)
                }}
                min={checkInDate ? format(new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="requests">Special Requests (Optional)</Label>
              <Textarea
                id="requests"
                placeholder="Any special requests or preferences..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-accent p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Room Type:</span>
                  <span className="capitalize">{room.room_type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {room.capacity} guests
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Price per night:</span>
                  <span>${room.price_per_night}</span>
                </div>
                {nights > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Number of nights:</span>
                      <span>{nights}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-primary">${totalAmount}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                disabled={!checkInDate || !checkOutDate || isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
